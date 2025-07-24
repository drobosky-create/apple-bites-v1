import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  MaterialCard, 
  MaterialCardHeader, 
  MaterialCardBody, 
  MaterialCardFooter,
  MaterialButton, 
  MaterialBackground,
  MaterialContainer,
  MaterialStatsCard,
} from "@/components/ui/material-dashboard-system";
import { Box, Typography } from '@mui/material';
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
      <div className="min-h-screen" style={{ background: 'var(--argon-background-default)' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--argon-background-default)' }}>
        <ArgonCard className="w-full max-w-md">
          <ArgonCardHeader>
            <ArgonTypography variant="h5" color="white" className="text-center mb-2">
              Authentication Required
            </ArgonTypography>
            <ArgonTypography variant="body2" color="white" className="text-center opacity-75">
              Please log in to access your dashboard.
            </ArgonTypography>
          </ArgonCardHeader>
          <ArgonCardContent>
            <ArgonButton 
              onClick={() => setLocation('/login')} 
              color="info"
              className="w-full"
              size="large"
            >
              Go to Login
            </ArgonButton>
          </ArgonCardContent>
        </ArgonCard>
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
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Authentic Argon Dashboard Header with Gradient */}
      <ArgonBox
        variant="gradient"
        bgGradient="primary"
        py={20}
        className="relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <ArgonBox>
              <ArgonTypography variant="h3" color="white" fontWeight="bold" className="mb-1">
                Welcome, {user.firstName} {user.lastName}
              </ArgonTypography>
              <ArgonTypography variant="body1" color="white" opacity={0.8} className="mb-3">
                {user.email}
              </ArgonTypography>
              <Badge className="bg-white/20 text-white border-white/30 font-medium">
                {tierInfo.name}
              </Badge>
            </ArgonBox>
            <ArgonButton 
              variant="outlined"
              color="white"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="border-white/30 hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </ArgonButton>
          </div>
        </div>
      </ArgonBox>

      {/* Authentic Argon Statistics Cards - Positioned over gradient header */}
      <ArgonBox mt={-8} mb={3} px={3}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DetailedStatisticsCard
              title="Account Status"
              count={user.resultReady ? "Active" : "Processing"}
              icon={{ 
                color: user.resultReady ? "success" : "info",
                component: user.resultReady ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />
              }}
              percentage={{
                color: "success",
                count: user.resultReady ? "100%" : "75%",
                text: "complete"
              }}
            />
            
            <DetailedStatisticsCard
              title="Assessment Tier"
              count={tierInfo.price}
              icon={{ 
                color: "primary",
                component: <TierIcon className="w-6 h-6" />
              }}
            />
            
            <DetailedStatisticsCard
              title="Reports Generated"
              count={user.resultReady ? "1" : "0"}
              icon={{ 
                color: "warning",
                component: <FileText className="w-6 h-6" />
              }}
              percentage={{
                color: user.resultReady ? "success" : "secondary",
                count: user.resultReady ? "+1" : "0",
                text: "this month"
              }}
            />
            
            <DetailedStatisticsCard
              title="Business Value"
              count="Calculated"
              icon={{ 
                color: "success",
                component: <DollarSign className="w-6 h-6" />
              }}
            />
          </div>
        </div>
      </ArgonBox>

      {/* Main Content - Authentic Argon Layout */}
      <ArgonBox px={3}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Assessment Status Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <ArgonBox p={3}>
              <ArgonTypography variant="h6" color="dark" fontWeight="bold" className="mb-1">
                Assessment Status
              </ArgonTypography>
              <ArgonTypography variant="body2" color="text" className="mb-4">
                Your {tierInfo.name} ({tierInfo.price})
              </ArgonTypography>
              
                <div className="flex items-center space-x-3">
                  {user.resultReady ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <ArgonTypography variant="body1" color="success" fontWeight="medium">
                        Results Ready
                      </ArgonTypography>
                      <Badge className="bg-green-100 text-green-800">
                        Complete
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-blue-500" />
                      <ArgonTypography variant="body1" color="info" fontWeight="medium">
                        Processing
                      </ArgonTypography>
                      <Badge className="bg-blue-100 text-blue-800">
                        In Progress
                      </Badge>
                    </>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <ArgonTypography variant="h6" color="dark" fontWeight="medium">
                    What's Included:
                  </ArgonTypography>
                  <ul className="space-y-2">
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
              </div>
            </ArgonBox>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <ArgonBox p={3}>
              <ArgonTypography variant="h6" color="dark" fontWeight="bold" className="mb-4">
                Actions
              </ArgonTypography>
                {user.resultReady ? (
                  <div className="space-y-3">
                    <ArgonButton variant="gradient" color="primary" size="large" className="w-full sm:w-auto">
                      <Download className="h-4 w-4 mr-2" />
                      Download Results
                    </ArgonButton>
                    <ArgonButton variant="outlined" color="secondary" size="large" className="w-full sm:w-auto">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Results
                    </ArgonButton>
                    <ArgonButton 
                      variant="gradient"
                      color="info"
                      size="large"
                      onClick={() => setLocation('/assessment/free')}
                      className="w-full sm:w-auto"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Take Free Assessment
                    </ArgonButton>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                      <ArgonTypography variant="body2" color="text">
                        Your assessment is being processed. Results will be available shortly.
                      </ArgonTypography>
                    </div>
                    <ArgonButton 
                      variant="gradient"
                      color="info"
                      size="large"
                      onClick={() => setLocation('/assessment/free')}
                      className="w-full sm:w-auto"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Take Free Assessment
                    </ArgonButton>
                    <ArgonButton 
                      variant="outlined"
                      color="secondary"
                      size="large"
                      onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                      className="w-full sm:w-auto"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Purchase Additional Assessments
                    </ArgonButton>
                  </div>
                )}
              </div>
            </ArgonBox>
          </div>

          {/* Support Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <ArgonBox p={3}>
              <ArgonTypography variant="h6" color="dark" fontWeight="bold" className="mb-3">
                Need Help?
              </ArgonTypography>
              <ArgonTypography variant="body2" color="text" className="mb-4">
                If you have questions about your assessment or need assistance, our team is here to help.
              </ArgonTypography>
              <ArgonButton variant="gradient" color="success">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </ArgonButton>
            </ArgonBox>
          </div>
        </div>
      </ArgonBox>
    </div>
  );
}