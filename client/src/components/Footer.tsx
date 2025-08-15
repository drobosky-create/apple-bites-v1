import React from 'react';

export function BuildFooter() {
  // Since we can't modify vite.config, use a simple timestamp-based build ID
  const buildId = process.env.NODE_ENV === 'development' ? 'dev' : Date.now().toString().slice(-6);
  
  return (
    <footer className="mt-auto py-2 px-4 text-xs text-gray-500 border-t">
      <div className="flex justify-between items-center">
        <span>© 2025 Apple Bites M&A Platform</span>
        <span>v{buildId}</span>
      </div>
    </footer>
  );
}