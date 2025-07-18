import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArgonStatCard } from "@/components/ui/argon-stat-card";
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
  AlertCircle,
  DollarSign,
  Users,
  BarChart3,
  Target
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-argon-primary"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 relative">
      {/* Argon Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      
      <div className="relative">
        {/* Header with Gradient Background */}
        <div className="bg-gradient-primary pt-20 pb-32 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.firstName} {user.lastName}</h1>
                <p className="text-white/80 text-lg mb-4">{user.email}</p>
                <Badge className="bg-white/20 text-white border-white/30 font-medium">
                  {tierInfo.name}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards Section - Positioned over gradient header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ArgonStatCard
              title="Account Status"
              value={user.resultReady ? "Active" : "Processing"}
              icon={user.resultReady ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
              color={user.resultReady ? "success" : "info"}
              trend={{
                value: user.resultReady ? "100%" : "75%",
                direction: "up",
                label: "complete"
              }}
            />
            
            <ArgonStatCard
              title="Assessment Tier"
              value={tierInfo.price}
              icon={<TierIcon className="w-6 h-6" />}
              color="primary"
              subtitle={tierInfo.name}
            />
            
            <ArgonStatCard
              title="Reports Generated"
              value={user.resultReady ? "1" : "0"}
              icon={<FileText className="w-6 h-6" />}
              color="warning"
              trend={{
                value: user.resultReady ? "+1" : "0",
                direction: user.resultReady ? "up" : "neutral",
                label: "this month"
              }}
            />
            
            <ArgonStatCard
              title="Business Value"
              value="Calculated"
              icon={<DollarSign className="w-6 h-6" />}
              color="success"
              subtitle={user.resultReady ? "Results available" : "Processing..."}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Assessment Status */}
          <Card className="shadow-argon">
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
          <Card className="shadow-argon">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.resultReady ? (
                <div className="space-y-3">
                  <Button className="w-full sm:w-auto bg-gradient-primary text-white" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download Results
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Results
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation('/assessment/free')}
                    className="w-full sm:w-auto bg-gradient-info text-white"
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
                    onClick={() => setLocation('/assessment/free')}
                    className="w-full sm:w-auto bg-gradient-info text-white"
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
          <Card className="shadow-argon">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                If you have questions about your assessment or need assistance, our team is here to help.
              </p>
              <Button variant="outline" className="bg-gradient-success text-white">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}