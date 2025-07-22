import { useEffect } from "react";
import { Link } from "wouter";

export default function RedirectHome() {
  useEffect(() => {
    // Temporary: Show navigation options instead of immediate redirect
    // window.location.href = "https://products.applebites.ai/";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Apple Bites Navigation</h1>
        <p className="text-gray-600">Choose your destination:</p>
        
        <div className="space-y-3">
          <Link href="/login">
            <div className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer">
              Go to Login Page
            </div>
          </Link>
          
          <Link href="/assessment/free">
            <div className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer">
              Go to Free Assessment
            </div>
          </Link>
          
          <a 
            href="https://products.applebites.ai/" 
            className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Product Page
          </a>
        </div>
      </div>
    </div>
  );
}