import { Loader2 } from "lucide-react";

interface LoadingModalProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingModal({ isVisible, message = "Processing your request..." }: LoadingModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Generating Your Valuation</h3>
          <p className="text-slate-600">{message}</p>
        </div>
      </div>
    </div>
  );
}
