import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, ArrowRight, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

export default function EmailCaptureModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false 
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(email);
  };

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">Almost There!</DialogTitle>
          <DialogDescription className="text-center">
            Enter your email to access your Growth & Exit Assessment after purchase
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-blue-100 text-blue-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Secure Checkout
              </Badge>
            </div>
            <p className="text-sm text-blue-700">
              We'll save your email to connect your purchase with your assessment results. 
              No spam, just your professional valuation report.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Your email is only used to deliver your assessment results. 
              <br />
              We respect your privacy and never share your information.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}