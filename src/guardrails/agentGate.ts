/* Agent Guard: prints rules and fails fast on obvious violations */
import fs from "fs";
import path from "path";

export function agentGate() {
  const promptPath = path.resolve(process.cwd(), "docs/AI_AGENT_SYSTEM_PROMPT.md");
  if (!fs.existsSync(promptPath)) {
    console.warn("[agentGate] Missing docs/AI_AGENT_SYSTEM_PROMPT.md — add it to keep rules visible.");
  } else {
    const snippet = fs.readFileSync(promptPath, "utf8").split("\n").slice(0, 12).join("\n");
    // Short banner so the agent sees rules in logs
    console.log("\n=== AI AGENT SYSTEM PROMPT (excerpt) ===\n" + snippet + "\n========================================\n");
  }

  // Hard stops for common "phantom" issues
  const banned = [
    "@mui/material/Unstable_Grid2", // Grid2 is not allowed
  ];
  
  const pkgPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.warn("[agentGate] package.json not found, skipping dependency checks");
    return;
  }
  
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  
  if (deps["@mui/material/Unstable_Grid2"]) {
    throw new Error("Grid2 detected in package.json. Use standard MUI Grid instead.");
  }

  // Check for phantom imports in source files
  const srcPath = path.resolve(process.cwd(), "client/src");
  if (fs.existsSync(srcPath)) {
    checkForPhantomImports(srcPath);
  }
}

function checkForPhantomImports(dir: string) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      checkForPhantomImports(fullPath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for Grid2 usage
      if (content.includes('@mui/material/Unstable_Grid2')) {
        throw new Error(`Grid2 import found in ${fullPath}. Use standard MUI Grid instead.`);
      }
      
      // Check for common phantom imports
      const phantomPatterns = [
        /@mui\/x-data-grid\/premium/,
        /@components\/phantom/,
        /from ['"]@\/components\/NonExistent/
      ];
      
      for (const pattern of phantomPatterns) {
        if (pattern.test(content)) {
          console.warn(`[agentGate] Potential phantom import detected in ${fullPath}`);
        }
      }
    }
  }
}