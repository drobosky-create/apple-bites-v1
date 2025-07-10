import { useEffect } from "react";

export default function RedirectHome() {
  useEffect(() => {
    // Redirect to products.applebites.ai
    window.location.href = "https://products.applebites.ai/";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderBottomColor: 'rgb(26, 35, 50)' }}></div>
        <h1 className="text-2xl font-bold" style={{ color: 'rgb(26, 35, 50)' }}>Redirecting...</h1>
        <p className="text-slate-600">Taking you to our assessment platform...</p>
        <p className="text-sm text-slate-500">
          If you're not redirected automatically, 
          <a 
            href="https://products.applebites.ai/" 
            className="hover:underline ml-1"
            style={{ color: 'rgb(26, 35, 50)' }}
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}