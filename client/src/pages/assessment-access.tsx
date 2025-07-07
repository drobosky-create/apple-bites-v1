import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AssessmentAccess() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  
  // Check for email parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const verifyPurchaseMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/verify-purchase", { email });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        // Store the assessment data and redirect to results
        localStorage.setItem('verifiedAssessmentData', JSON.stringify(data.assessmentData));
        localStorage.setItem('paymentVerified', 'true');
        
        toast({
          title: "Purchase Verified!",
          description: "Redirecting to your assessment results...",
        });
        
        // Redirect to strategic assessment results
        setTimeout(() => {
          setLocation("/strategic-assessment/results");
        }, 1500);
      } else {
        toast({
          title: "No Purchase Found",
          description: "We couldn't find a purchase with that email. Please try again or contact support.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: "There was an error verifying your purchase. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    await verifyPurchaseMutation.mutateAsync(email);
    setIsLoading(false);
  };

  const handleTryLocalStorage = () => {
    // Check if there's assessment data in localStorage
    const localData = localStorage.getItem('growthExitAssessmentData');
    if (localData) {
      try {
        const assessmentData = JSON.parse(localData);
        // Check if there's contact info with email
        if (assessmentData.email) {
          setEmail(assessmentData.email);
          toast({
            title: "Found Previous Assessment",
            description: "We found your assessment data. Click verify to continue.",
          });
        } else {
          toast({
            title: "Assessment Data Found",
            description: "We found your assessment but need your email to verify purchase.",
          });
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    } else {
      toast({
        title: "No Assessment Data",
        description: "No previous assessment found. Please retake the assessment.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Access Your Assessment</CardTitle>
              <p className="text-gray-600 mt-2">
                Enter the email address you used at checkout to access your Growth & Exit Assessment results.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    <Mail className="w-3 h-3 mr-1" />
                    Thank You!
                  </Badge>
                </div>
                <p className="text-sm text-blue-700">
                  Your purchase was successful. Enter your email below to continue with your comprehensive assessment results.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying Purchase...
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleTryLocalStorage}
                  className="text-sm"
                >
                  Use Previous Assessment Data
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>
                  Can't find your purchase? 
                  <a href="mailto:support@meritage-partners.com" className="text-blue-600 hover:text-blue-800 ml-1">
                    Contact Support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}