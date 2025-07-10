import { useEffect } from "react";

export default function RedirectHome() {
  useEffect(() => {
    // Redirect to products.applebites.ai
    window.location.href = "https://products.applebites.ai/";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h1 className="text-2xl font-bold text-gray-900">Redirecting...</h1>
        <p className="text-gray-600">Taking you to our assessment platform...</p>
        <p className="text-sm text-gray-500">
          If you're not redirected automatically, 
          <a 
            href="https://products.applebites.ai/" 
            className="text-blue-600 hover:underline ml-1"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}