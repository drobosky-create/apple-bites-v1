import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Star, Building2, TrendingUp, DollarSign, FileText, Calculator, Zap } from "lucide-react";
import { useLocation } from "wouter";

function StrategicAssessment() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const totalSteps = 6;

  const handleBack = () => {
    setLocation("/");
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderProgressBar = () => {
    const progress = (currentStep / totalSteps) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
              <p className="text-gray-600">Let's start with your basic information</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Smith"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Company LLC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Industry Classification</CardTitle>
              <p className="text-gray-600">Help us understand your business sector</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Industry Sector *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select your industry sector</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="construction">Construction</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="wholesale">Wholesale Trade</option>
                  <option value="retail">Retail Trade</option>
                  <option value="transportation">Transportation</option>
                  <option value="information">Information Technology</option>
                  <option value="finance">Finance & Insurance</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="professional">Professional Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Specific Industry (NAICS Code)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 541211 - Offices of Certified Public Accountants"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Description *</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="Describe your business operations, products/services, and target market..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Years in Business</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Employees</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Financial Information</CardTitle>
              <p className="text-gray-600">Provide your key financial metrics</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Annual Revenue (Last 12 Months) *</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cost of Goods Sold (COGS)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="400000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Operating Expenses *</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="350000"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calculator className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Calculated EBITDA</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">$250,000</div>
                <p className="text-sm text-blue-700">This will be refined with your adjustments</p>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl">EBITDA Adjustments</CardTitle>
              <p className="text-gray-600">Normalize your earnings for valuation</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Owner's Salary Above Market Rate</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Personal Expenses Run Through Business</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">One-Time Expenses</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="15000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Other Adjustments</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10000"
                />
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">Adjusted EBITDA</span>
                </div>
                <div className="text-2xl font-bold text-green-600">$350,000</div>
                <p className="text-sm text-green-700">Ready for value driver analysis</p>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl">Strategic Value Drivers</CardTitle>
              <p className="text-gray-600">Rate your business across key value dimensions</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                "Financial Performance",
                "Growth Potential", 
                "Market Position",
                "Management Team",
                "Customer Base",
                "Operational Efficiency",
                "Industry Trends",
                "Competitive Advantage"
              ].map((driver, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium">{driver}</label>
                  <div className="flex space-x-2">
                    {["A", "B", "C", "D", "F"].map((grade) => (
                      <button
                        key={grade}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center font-bold transition-colors"
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calculator className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="font-medium text-indigo-900">Multiplier Preview</span>
                </div>
                <div className="text-lg font-bold text-indigo-600">4.2x Industry Multiple</div>
                <p className="text-sm text-indigo-700">Based on your industry and current ratings</p>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Complete Your Assessment</CardTitle>
              <p className="text-gray-600">Review and finalize your strategic valuation</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Assessment Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Adjusted EBITDA:</span>
                    <div className="font-bold text-lg">$350,000</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Industry Multiple:</span>
                    <div className="font-bold text-lg">4.2x</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Estimated Value:</span>
                    <div className="font-bold text-xl text-green-600">$1,470,000</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Value Range:</span>
                    <div className="font-bold text-lg">$1.2M - $1.7M</div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Additional Comments</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                  placeholder="Any additional information about your business..."
                />
              </div>

              <div className="text-center">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-bold">
                  Generate Strategic Report - $395
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Secure payment processed by Stripe
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <Badge className="bg-green-100 text-green-800">Secure Assessment</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700"
          >
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              Continue
            </Button>
          ) : (
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="w-4 h-4 mr-1" />
              Complete assessment above
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StrategicAssessment;