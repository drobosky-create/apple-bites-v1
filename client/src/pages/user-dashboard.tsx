import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  Crown, 
  TrendingUp, 
  FileText, 
  Download, 
  ExternalLink,
  LogOut,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  tier: 'free' | 'growth' | 'capital';
  resultReady: boolean;
}

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user: authUser, isLoading: authLoading } = useAuth();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!authUser,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      window.location.href = '/api/logout';
    },
    onSuccess: () => {
      toast({
        title: "Logging out...",
        description: "You are being logged out of your account.",
      });
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#4F83F7' }}></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-gray-800">Authentication Required</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Please log in to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation('/login')} 
              className="w-full text-white font-medium"
              style={{ backgroundColor: '#4F83F7' }}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'growth':
        return {
          name: 'Growth & Exit Assessment',
          icon: TrendingUp,
          color: 'bg-blue-600',
          description: 'Professional industry-specific analysis with AI insights',
          price: '$795',
        };
      case 'capital':
        return {
          name: 'Capital Readiness Assessment',
          icon: Crown,
          color: 'bg-indigo-600',
          description: 'Comprehensive capital readiness analysis and strategic planning',
          price: '$2,500',
        };
      default:
        return {
          name: 'Free Assessment',
          icon: FileText,
          color: 'bg-gray-500',
          description: 'Basic business valuation analysis',
          price: 'Free',
        };
    }
  };

  const tierInfo = getTierInfo(user.tier);
  const TierIcon = tierInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${tierInfo.color} text-white`}>
                  <TierIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Welcome, {user.firstName} {user.lastName}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>{user.email}</span>
                    <Badge variant="secondary" className="ml-2">
                      {tierInfo.name}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Assessment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Status</CardTitle>
            <CardDescription>
              Your {tierInfo.name} ({tierInfo.price})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              {user.resultReady ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-700 font-medium">Results Ready</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Complete
                  </Badge>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-blue-700 font-medium">Processing</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    In Progress
                  </Badge>
                </>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">What's Included:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {user.tier === 'growth' && (
                  <>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Industry-specific NAICS multipliers</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>AI-powered growth insights and recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Market positioning analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Professional PDF report</span>
                    </li>
                  </>
                )}
                {user.tier === 'capital' && (
                  <>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Comprehensive capital readiness assessment</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Strategic planning and growth recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Investor presentation materials</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Executive summary and action plan</span>
                    </li>
                  </>
                )}
                {user.tier === 'free' && (
                  <>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Basic EBITDA calculation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>General business valuation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>PDF report summary</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.resultReady ? (
              <div className="space-y-3">
                <Button className="w-full sm:w-auto" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Results
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" size="lg">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Results
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/assessment')}
                  className="w-full sm:w-auto bg-[#415A77] text-white hover:bg-[#1B263B]"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Take Free Assessment
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Your assessment is being processed. Results will be available shortly.
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/assessment')}
                  className="w-full sm:w-auto bg-[#415A77] text-white hover:bg-[#1B263B]"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Take Free Assessment
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                  className="w-full sm:w-auto"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Purchase Additional Assessments
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              If you have questions about your assessment or need assistance, our team is here to help.
            </p>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}