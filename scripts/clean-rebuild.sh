#!/bin/bash

# Bulletproof refresh routine for Apple Bites platform

echo "🧹 Cleaning old build..."
rm -rf dist

echo "🔨 Building with new BUILD_ID..."
export BUILD_ID=$(date +%s)
npm run build

echo "✅ Build complete! New BUILD_ID: $BUILD_ID"

echo "🔍 Verifying assets..."
ls -la dist/public/assets | head -5

echo "🚀 Ready to restart server!"
echo "Server will log: serving on port 5000 (build: $BUILD_ID)"

echo "📋 Quick verification commands:"
echo "  curl -s http://localhost:5000/__version"
echo "  curl -I http://localhost:5000/assets/index-*.css"
echo "  Hard refresh browser: Ctrl/Cmd+Shift+R"