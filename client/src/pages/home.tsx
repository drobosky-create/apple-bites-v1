import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, TrendingUp, FileText, BarChart3, Users } from 'lucide-react';
import { useLocation } from 'wouter';
import appleBitesLogo from "@assets/Apple Bites Business Assessment V2_1750116954168.png";
import EmailCaptureModal from "@/components/email-capture-modal";

export default function Home() {
  const [, setLocation] = useLocation();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFreeTierStart = () => {
    setLocation('/assessment/free');
  };

  const handlePaidTierStart = () => {
    setEmailModalOpen(true);
  };

  const handleEmailSubmit = async (email: string) => {
    setIsProcessing(true);
    
    try {
      // Store email in localStorage for post-purchase access
      localStorage.setItem('purchaseEmail', email);
      
      // Redirect to Apple Bites checkout
      window.location.href = 'https://products.applebites.ai/product-details/product/686c2e0f5f2f1191edb09737';
    } catch (error) {
      console.error('Error processing email:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <img 
            src={appleBitesLogo} 
            alt="Apple Bites Business Assessment" 
            className="h-20 w-auto mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Know Your Business Worth
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get a comprehensive business valuation with our professional assessment tool. 
            Choose between our free basic analysis or strategic professional report.
          </p>
        </div>

        {/* Tier Selection Cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Free Tier */}
            <Card className="border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-col space-y-1.5 p-6 text-center ml-[0px] mr-[0px] pl-[24px] pr-[24px] pt-[23px] pb-[23px]">
                <Badge variant="outline" className="w-fit mx-auto border-blue-200 text-blue-600 text-[20px] mt-[9px] mb-[9px]">
                  BASIC REPORT
                </Badge>
                <CardTitle className="text-2xl text-[#1a2332]">Standard Analysis</CardTitle>
                <div className="text-4xl font-bold text-[#1a2332] mt-2">Free</div>
                <p className="text-gray-600 mt-2">Perfect for initial business insights</p>
              </CardHeader>
              <CardContent className="p-6 bg-white pt-[14px] pb-[14px] rounded-lg">
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#1a2332]">General EBITDA Multipliers</div>
                      <div className="text-sm text-gray-700">Standard 3x-8x range based on performance grades</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#1a2332]">Value Driver Assessment</div>
                      <div className="text-sm text-gray-700">A-F grades across 10 key business factors</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#1a2332]">Basic PDF Report</div>
                      <div className="text-sm text-gray-700">Clean, professional valuation summary</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#1a2332]">Email Delivery</div>
                      <div className="text-sm text-gray-700">Instant delivery to your inbox</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#1a2332]">Business Insights</div>
                      <div className="text-sm text-gray-700">Key improvement areas and recommendations</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleFreeTierStart}
                  className="w-full bg-[#1a2332] text-white hover:bg-[#2a3442] h-12 text-lg font-semibold"
                >
                  Start Free Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Paid Tier */}
            <Card className="border-2 border-[#f5c842] hover:border-yellow-400 transition-all duration-300 hover:shadow-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#f5c842] text-[#1a2332] hover:bg-[#f5c842] px-4 py-1 text-sm font-bold ml-[-15px] mr-[-15px]">
                  <Star className="w-4 h-4 mr-1" />
                  RECOMMENDED
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-4 pt-8 ml-[9px] mr-[9px]">
                <Badge variant="outline" className="w-fit mx-auto border-[#f5c842] text-[#f5c842] text-[20px] mt-[9px] mb-[9px]">
                  GROWTH & EXIT ASSESSMENT
                </Badge>
                <CardTitle className="text-2xl text-[#fcfcfc]">Professional Analysis</CardTitle>
                <div className="text-4xl font-bold mt-2 text-[#f5c842]">$795</div>
                <p className="mt-2 text-[#f8fafc]">Comprehensive industry-specific valuation</p>
              </CardHeader>
              <CardContent className="p-6 bg-[#f8fafc] pt-[14px] pb-[14px] rounded-lg">
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#1a2332]">Industry-Specific NAICS Multipliers</div>
                      <div className="text-sm text-gray-700">Precise multipliers based on your exact industry</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#1a2332]">AI-Powered Growth Insights</div>
                      <div className="text-sm text-gray-700">Detailed analysis and improvement recommendations</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#1a2332]">Market Positioning Analysis</div>
                      <div className="text-sm text-gray-700">See where you stand against industry benchmarks</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#1a2332]">Professional Presentation PDF</div>
                      <div className="text-sm text-gray-700">Investor-ready report with charts and visuals</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#1a2332]">Executive Summary & Action Plan</div>
                      <div className="text-sm text-gray-700">Clear roadmap for value improvement</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePaidTierStart}
                  className="w-full bg-[#f5c842] text-[#1a2332] hover:bg-[#e6b63a] h-12 text-lg font-bold"
                >
                  Get Growth & Exit Assessment - $795
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[#1a2332] mb-4">Trusted by Business Owners</h3>
              <p className="text-gray-700">Join thousands who have valued their business with our platform</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 text-center max-w-lg mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-[#1a2332] mb-2">5,000+</div>
                <div className="text-gray-700 font-medium">Businesses Valued</div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-[#1a2332] mb-2">98%</div>
                <div className="text-gray-700 font-medium">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <EmailCaptureModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSubmit={handleEmailSubmit}
        isLoading={isProcessing}
      />
    </div>
  );
}