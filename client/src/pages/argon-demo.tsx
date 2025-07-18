import { ArgonBox, ArgonTypography, ArgonButton } from "@/components/ui/argon-authentic";
import { DetailedStatisticsCard } from "@/components/ui/argon-statistics-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  DollarSign
} from "lucide-react";

// Demo component to showcase Argon Dashboard design
export default function ArgonDemo() {
  // Mock user data for demo
  const user = {
    id: "demo-user",
    email: "demo@applebites.ai",
    firstName: "John",
    lastName: "Smith",
    tier: 'growth',
    resultReady: true
  };

  const tierInfo = {
    name: 'Growth & Exit Assessment',
    icon: TrendingUp,
    color: 'bg-blue-600',
    description: 'Professional industry-specific analysis with AI insights',
    price: '$795',
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
            <ArgonButton 
              variant="outlined"
              color="white"
              className="border-white/30 hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </ArgonButton>
          </div>
        </div>
      </ArgonBox>
      {/* Authentic Argon Statistics Cards - Positioned over gradient header */}
      <ArgonBox mt={3} mb={3} px={3} className="bg-transparent pt-[1px] pb-[1px] pl-[21px] pr-[21px] mt-[16px] mb-[16px]">
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
                count: "+15%",
                text: "vs industry avg"
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
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <ArgonTypography variant="body1" color="success" fontWeight="medium">
                    Results Ready
                  </ArgonTypography>
                  <Badge className="bg-green-100 text-green-800">
                    Complete
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <ArgonTypography variant="h6" color="dark" fontWeight="medium">
                    What's Included:
                  </ArgonTypography>
                  <ul className="space-y-2">
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
                <div className="flex flex-col sm:flex-row justify-left items-center gap-4 sm:gap-6">
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
                    className="w-full sm:w-auto"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Take Free Assessment
                  </ArgonButton>
                </div>
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