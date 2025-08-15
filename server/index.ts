import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import summaryRoute from './routes/summary';

const app = express();
app.use(express.json());

// Agent guardrails: print system prompt and check for violations
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

try {
  const promptPath = resolve(process.cwd(), "docs/AI_AGENT_SYSTEM_PROMPT.md");
  
  if (existsSync(promptPath)) {
    const snippet = readFileSync(promptPath, "utf8").split("\n").slice(0, 8).join("\n");
    console.log("\n=== AI AGENT SYSTEM PROMPT (excerpt) ===\n" + snippet + "\n========================================\n");
  }
  
  // Check for Grid2 in package.json
  const pkgPath = resolve(process.cwd(), "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    if (deps["@mui/material/Unstable_Grid2"]) {
      throw new Error("Grid2 detected in package.json. Use standard MUI Grid instead.");
    }
  }
} catch (error: any) {
  console.warn("[agentGate] Warning:", error.message);
}

// Session configuration will be handled by setupAuth in routes
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // 1) Static assets FIRST (no auth, for production)
  const clientDist = path.resolve(import.meta.dirname, '..', 'dist', 'public');
  if (app.get("env") !== "development") {
    app.use(express.static(clientDist, { index: false }));
  }
  
  // 2) Serve public directory assets (always available)
  app.use(express.static('public'));
  
  // 3) API routes with auth scoped properly
  app.use('/api', summaryRoute);
  const server = await registerRoutes(app);

  // 4) Initialize automation system
  try {
    const { loadAndBindRules } = await import('./automation/executor');
    await loadAndBindRules();
    console.log('Automation system initialized');
  } catch (error) {
    console.error('Failed to initialize automation system:', error);
  }

  // 5) Vite dev middleware OR SPA fallback routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // SPA routes for workspace
    app.get(['/workspace', '/workspace/*'], (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
    
    // Final catch-all for SPA
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  // 6) Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // 7) Start server
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
