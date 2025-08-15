module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "no-restricted-imports": ["error", {
      "paths": [
        { 
          "name": "@mui/material/Unstable_Grid2", 
          "message": "Use MUI Grid, not Grid2. Grid2 is unstable and not allowed in Apple Bites ecosystem." 
        },
        {
          "name": "@mui/x-data-grid/premium",
          "message": "Use standard DataGrid from @mui/x-data-grid instead of premium features."
        }
      ],
      "patterns": [
        {
          "group": ["**/phantom/**", "**/NonExistent/**"],
          "message": "Phantom imports are not allowed. Verify component exists before importing."
        }
      ]
    }],
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error", "info"] }]
  },
  ignorePatterns: [
    "dist/",
    "node_modules/",
    "build/",
    "*.config.js",
    "*.config.ts"
  ]
};