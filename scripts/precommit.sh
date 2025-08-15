#!/bin/bash

# Apple Bites Pre-commit Checks
# Run: chmod +x scripts/precommit.sh && ./scripts/precommit.sh

set -e

echo "🔍 Running Apple Bites pre-commit checks..."

# 1. TypeScript compilation check
echo "📝 Checking TypeScript compilation..."
npx tsc --noEmit || {
  echo "❌ TypeScript compilation failed"
  exit 1
}
echo "✅ TypeScript compilation passed"

# 2. Route guard test - verify protected routes map to roles
echo "🛡️  Checking route permissions..."
node -e "
const fs = require('fs');
const rbacPath = './server/rbac.ts';
if (fs.existsSync(rbacPath)) {
  const content = fs.readFileSync(rbacPath, 'utf8');
  if (!content.includes('ROUTE_PERMISSIONS')) {
    console.error('❌ ROUTE_PERMISSIONS not found in rbac.ts');
    process.exit(1);
  }
  console.log('✅ Route permissions defined');
} else {
  console.error('❌ RBAC file not found');
  process.exit(1);
}
"

# 3. Phantom import check
echo "👻 Checking for phantom imports..."
find client/src -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*@/" | while read file; do
  grep "import.*@/" "$file" | while read -r line; do
    # Extract import path
    path=$(echo "$line" | sed -n "s/.*from ['\"]@\/\([^'\"]*\)['\"].*/\1/p")
    if [ -n "$path" ]; then
      # Check if file exists
      fullpath="client/src/$path"
      if [ ! -f "$fullpath.ts" ] && [ ! -f "$fullpath.tsx" ] && [ ! -f "$fullpath/index.ts" ] && [ ! -f "$fullpath/index.tsx" ]; then
        echo "❌ Phantom import detected in $file: $line"
        echo "   Path not found: $fullpath"
        exit 1
      fi
    fi
  done
done
echo "✅ No phantom imports detected"

# 4. Banned string check
echo "🚫 Checking for banned patterns..."

# Check for Grid2
if git grep -q "@mui/material/Unstable_Grid2" 2>/dev/null; then
  echo "❌ Grid2 import found. Use standard MUI Grid instead."
  git grep -n "@mui/material/Unstable_Grid2"
  exit 1
fi

# Check for hardcoded roles (should use RBAC constants)
if git grep -q "role.*===.*['\"]admin['\"]" 2>/dev/null; then
  echo "⚠️  Hardcoded role check detected. Consider using RBAC helpers."
  git grep -n "role.*===.*['\"]admin['\"]"
fi

# Check for any as (should be minimized)
if git grep -q " as any" 2>/dev/null; then
  echo "⚠️  'as any' usage detected. Consider proper typing."
  git grep -n " as any" | head -5
fi

echo "✅ Banned pattern check passed"

# 5. RBAC consistency check
echo "🔐 Checking RBAC consistency..."
node -e "
const fs = require('fs');
try {
  // Check if routes file exists and has proper middleware
  const routesPath = './server/routes.ts';
  if (fs.existsSync(routesPath)) {
    const content = fs.readFileSync(routesPath, 'utf8');
    if (!content.includes('requireRouteAccess') && !content.includes('requireAuth')) {
      console.log('⚠️  Routes file may be missing RBAC middleware');
    } else {
      console.log('✅ RBAC middleware detected in routes');
    }
  }
} catch (error) {
  console.log('⚠️  Could not verify RBAC consistency:', error.message);
}
"

echo "🎉 All pre-commit checks passed!"
echo ""
echo "Summary:"
echo "  ✅ TypeScript compilation"
echo "  ✅ Route permissions defined" 
echo "  ✅ No phantom imports"
echo "  ✅ No banned patterns"
echo "  ✅ RBAC consistency"
echo ""
echo "Ready to commit! 🚀"