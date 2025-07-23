import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

function TestComponent() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Apple Bites Business Valuator
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Application is loading successfully!
        </p>
        <div className="space-y-4">
          <a 
            href="/value-calculator" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Value Calculator
          </a>
          <br />
          <a 
            href="/login" 
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TestComponent />
      <Toaster />
    </QueryClientProvider>
  );
}