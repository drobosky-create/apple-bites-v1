import React from "react";
import { useLocation } from "wouter";
import { 
  ArgonBox, 
  ArgonButton, 
  ArgonTypography
} from "@/components/ui/argon-authentic";
import { DetailedStatisticsCard } from "@/components/ui/argon-statistics-card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Download, 
  Mail, 
  FileText, 
  Calendar,
  TrendingUp,
  Star,
  Crown,
  CheckCircle,
  Clock
} from "lucide-react";

export default function AssessmentResults() {
  const [, setLocation] = useLocation();

  // Mock user data - would come from API
  const user = {
    id: "user-123",
    email: "demo@applebites.ai",
    firstName: "John",
    lastName: "Smith",
    tier: 'growth' as const
  };

  // Mock assessment data - would come from API
  const assessments = [
    {
      id: "assessment-1",
      type: "Growth & Exit Assessment",
      tier: "growth",
      status: "completed",
      completedDate: "2025-01-15",
      businessValue: "$2.4M",
      ebitda: "$485K",
      multiplier: "4.9x",
      industry: "Professional Services",
      grade: "B+",
      icon: TrendingUp,
      color: "bg-blue-600"
    },
    {
      id: "assessment-2", 
      type: "Free Assessment",
      tier: "free",
      status: "completed",
      completedDate: "2025-01-10",
      businessValue: "$1.8M",
      ebitda: "$320K",
      multiplier: "5.6x",
      industry: "General",
      grade: "B",
      icon: Star,
      color: "bg-gray-500"
    },
    {
      id: "assessment-3",
      type: "Capital Readiness Assessment", 
      tier: "capital",
      status: "processing",
      completedDate: null,
      businessValue: null,
      ebitda: null,
      multiplier: null,
      industry: "Technology",
      grade: null,
      icon: Crown,
      color: "bg-indigo-600"
    }
  ];

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'growth':
        return { name: 'Growth & Exit', color: 'bg-blue-100 text-blue-800' };
      case 'capital':
        return { name: 'Capital Readiness', color: 'bg-indigo-100 text-indigo-800' };
      default:
        return { name: 'Free', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
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
                  className="h-12 w-auto"
                />
              </div>
              <ArgonBox>
                <ArgonTypography variant="h5" color="white" fontWeight="bold" className="mb-1">
                  Assessment Results
                </ArgonTypography>
                <ArgonTypography variant="body2" color="white" opacity={0.8}>
                  View and manage all your business assessments
                </ArgonTypography>
              </ArgonBox>
            </div>
            <ArgonButton 
              variant="outlined"
              color="white"
              onClick={() => setLocation('/')}
              className="border-white/30 hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </ArgonButton>
          </div>
        </div>
      </ArgonBox>

      {/* Statistics Cards */}
      <ArgonBox mt={-3} mb={3} px={3} className="bg-transparent mt-[14px] mb-[14px]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DetailedStatisticsCard
              title="Total Assessments"
              count={assessments.length.toString()}
              icon={{ 
                color: "info",
                component: <FileText className="w-6 h-6" />
              }}
              percentage={{
                color: "success",
                count: "+1",
                text: "this month"
              }}
            />
            
            <DetailedStatisticsCard
              title="Completed"
              count={assessments.filter(a => a.status === 'completed').length.toString()}
              icon={{ 
                color: "success",
                component: <CheckCircle className="w-6 h-6" />
              }}
            />
            
            <DetailedStatisticsCard
              title="Processing"
              count={assessments.filter(a => a.status === 'processing').length.toString()}
              icon={{ 
                color: "warning",
                component: <Clock className="w-6 h-6" />
              }}
            />
            
            <DetailedStatisticsCard
              title="Latest Value"
              count={assessments.find(a => a.status === 'completed')?.businessValue || "N/A"}
              icon={{ 
                color: "primary",
                component: <TrendingUp className="w-6 h-6" />
              }}
            />
          </div>
        </div>
      </ArgonBox>

      {/* Assessment Results */}
      <ArgonBox px={3}>
        <div className="max-w-7xl mx-auto space-y-6">
          {assessments.map((assessment) => {
            const tierBadge = getTierBadge(assessment.tier);
            const AssessmentIcon = assessment.icon;
            
            return (
              <div key={assessment.id} className="bg-white rounded-xl shadow-lg border border-gray-100">
                <ArgonBox p={4}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${assessment.color} flex items-center justify-center`}>
                        <AssessmentIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <ArgonTypography variant="h6" color="dark" fontWeight="bold" className="mb-1">
                          {assessment.type}
                        </ArgonTypography>
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={tierBadge.color}>
                            {tierBadge.name}
                          </Badge>
                          {assessment.status === 'completed' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Processing
                            </Badge>
                          )}
                        </div>
                        {assessment.completedDate && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Completed: {new Date(assessment.completedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {assessment.status === 'completed' ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <ArgonTypography variant="h6" color="primary" fontWeight="bold">
                          {assessment.businessValue}
                        </ArgonTypography>
                        <ArgonTypography variant="body2" color="text">
                          Business Value
                        </ArgonTypography>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <ArgonTypography variant="h6" color="success" fontWeight="bold">
                          {assessment.ebitda}
                        </ArgonTypography>
                        <ArgonTypography variant="body2" color="text">
                          EBITDA
                        </ArgonTypography>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <ArgonTypography variant="h6" color="info" fontWeight="bold">
                          {assessment.multiplier}
                        </ArgonTypography>
                        <ArgonTypography variant="body2" color="text">
                          Multiplier
                        </ArgonTypography>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <ArgonTypography variant="h6" color="warning" fontWeight="bold">
                          {assessment.grade}
                        </ArgonTypography>
                        <ArgonTypography variant="body2" color="text">
                          Overall Grade
                        </ArgonTypography>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <ArgonTypography variant="body2" color="info" className="text-center">
                        Assessment is being processed. Results will be available shortly.
                      </ArgonTypography>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {assessment.status === 'completed' ? (
                      <>
                        <ArgonButton variant="gradient" color="primary" size="medium">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </ArgonButton>
                        <ArgonButton variant="gradient" color="info" size="medium">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Results
                        </ArgonButton>
                        <ArgonButton variant="outlined" color="secondary" size="medium">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </ArgonButton>
                      </>
                    ) : (
                      <ArgonButton variant="outlined" color="secondary" size="medium" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        Processing...
                      </ArgonButton>
                    )}
                  </div>
                </ArgonBox>
              </div>
            );
          })}
        </div>
      </ArgonBox>
    </div>
  );
}