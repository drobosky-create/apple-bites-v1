import { ArgonBox, ArgonTypography, ArgonButton } from "@/components/ui/argon-authentic";
import { DetailedStatisticsCard } from "@/components/ui/argon-statistics-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
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
  Star
} from "lucide-react";

export default function FreeTierDemo() {
  const [, setLocation] = useLocation();

  // Mock Growth tier user data for demonstration
  const user = {
    id: "growth-user-123",
    email: "demo@company.com",
    firstName: "Sarah",
    lastName: "Johnson",
    tier: 'growth' as const,
    resultReady: true
  };

  const tierInfo = {
    name: "Growth & Exit Assessment",
    price: "$795",
    color: "primary" as const,
    icon: TrendingUp
  };

  const TierIcon = tierInfo.icon;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Authentic Argon Dashboard Header with Your Brand Gradient */}
      <ArgonBox
        variant="gradient"
        bgGradient="primary"
        py={3}
        className="relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="/apple-bites-logo.png" 
                  alt="Apple Bites Business Assessment" 
                  className="h-20 w-auto"
                />
              </div>
              <ArgonBox>
                <ArgonTypography variant="h5" color="white" fontWeight="bold" className="mb-1">
                  Welcome, {user.firstName} {user.lastName}
                </ArgonTypography>
                <ArgonTypography variant="body2" color="white" opacity={0.8} className="mb-1">
                  {user.email}
                </ArgonTypography>
                <Badge className="bg-white/20 text-white border-white/30 font-medium">
                  {tierInfo.name}
                </Badge>
              </ArgonBox>
            </div>
            <ArgonButton 
              variant="outlined"
              color="white"
              onClick={() => setLocation('/login')}
              className="border-white/30 hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </ArgonButton>
          </div>
        </div>
      </ArgonBox>

      {/* Authentic Argon Statistics Cards - Positioned over gradient header */}
      <ArgonBox mt={3} mb={3} px={3} className="bg-transparent" style={{ marginTop: '14px', marginBottom: '14px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DetailedStatisticsCard
              title="Account Status"
              count="Active"
              icon={{ 
                color: "success",
                component: <CheckCircle className="w-6 h-6" />
              }}
              percentage={{
                color: "success",
                count: "100%",
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
              count="1"
              icon={{ 
                color: "warning",
                component: <FileText className="w-6 h-6" />
              }}
              percentage={{
                color: "success",
                count: "+1",
                text: "this month"
              }}
            />
            
            <DetailedStatisticsCard
              title="Business Value"
              count="$2.4M"
              icon={{ 
                color: "success",
                component: <DollarSign className="w-6 h-6" />
              }}
              percentage={{
                color: "success",
                count: "85%",
                text: "above industry avg"
              }}
            />
          </div>
        </div>
      </ArgonBox>

      {/* Main Content - Free Tier Experience */}
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
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <ArgonTypography variant="body1" color="success" fontWeight="medium">
                    Assessment Complete
                  </ArgonTypography>
                  <Badge className="bg-green-100 text-green-800">
                    Results Available
                  </Badge>
                </div>

                <Separator />

                {/* Latest Results Summary */}
                <div className="space-y-3">
                  <ArgonTypography variant="h6" color="dark" fontWeight="medium">
                    Latest Assessment Results:
                  </ArgonTypography>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <ArgonTypography variant="body2" color="text" className="text-sm opacity-75">
                          Estimated Business Value
                        </ArgonTypography>
                        <ArgonTypography variant="h6" color="info" fontWeight="bold">
                          $2.4M
                        </ArgonTypography>
                      </div>
                      <div>
                        <ArgonTypography variant="body2" color="text" className="text-sm opacity-75">
                          EBITDA Multiple
                        </ArgonTypography>
                        <ArgonTypography variant="h6" color="info" fontWeight="bold">
                          4.9x (85% above industry avg)
                        </ArgonTypography>
                      </div>
                      <div>
                        <ArgonTypography variant="body2" color="text" className="text-sm opacity-75">
                          Industry
                        </ArgonTypography>
                        <ArgonTypography variant="body1" color="dark" fontWeight="medium">
                          Professional Services
                        </ArgonTypography>
                      </div>
                      <div>
                        <ArgonTypography variant="body2" color="text" className="text-sm opacity-75">
                          Report Date
                        </ArgonTypography>
                        <ArgonTypography variant="body1" color="dark" fontWeight="medium">
                          Jan 15, 2025
                        </ArgonTypography>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <ArgonTypography variant="h6" color="dark" fontWeight="medium">
                    What's Included:
                  </ArgonTypography>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Industry-specific EBITDA multipliers</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>AI-powered growth insights and recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Professional PDF report with market analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Strategic growth recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Industry benchmarking and positioning analysis</span>
                    </li>
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
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <ArgonTypography variant="body2" color="text">
                    Your latest assessment is complete. View detailed results or take a new assessment.
                  </ArgonTypography>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <ArgonButton 
                    variant="gradient"
                    color="success"
                    size="large"
                    onClick={() => setLocation('/assessment-results')}
                    className="flex-shrink-0 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View All Results
                  </ArgonButton>
                  <ArgonButton 
                    variant="gradient"
                    color="info"
                    size="large"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setLocation('/assessment/free');
                    }}
                    className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Take Free Assessment
                  </ArgonButton>
                  <ArgonButton 
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Purchase Additional Assessments
                  </ArgonButton>
                </div>
              </div>
            </ArgonBox>
          </div>

          {/* Need Help Section - Gradient Background */}
          <div className="bg-gradient-to-r from-[#0b2147] to-blue-600 rounded-xl shadow-lg text-white">
            <ArgonBox p={3}>
              <ArgonTypography variant="h6" color="white" fontWeight="bold" className="mb-3">
                Need Help?
              </ArgonTypography>
              <ArgonTypography variant="body2" color="white" className="mb-4 opacity-90">
                If you have questions about your assessment or need assistance, our team is here to help.
              </ArgonTypography>
              <ArgonButton variant="contained" color="white" className="flex-shrink-0">
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