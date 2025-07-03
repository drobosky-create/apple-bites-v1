import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Star, Building2, TrendingUp, DollarSign, FileText, Calculator, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

function StrategicAssessment() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    primarySector: "",
    specificIndustry: "",
    naicsCode: "", // Will store the full 6-digit NAICS code
    sectorCode: "", // Will store the 2-digit sector code
    businessDescription: "",
    yearsInBusiness: "",
    numberOfEmployees: ""
  });
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedSectorCode, setSelectedSectorCode] = useState("");
  const totalSteps = 6;

  // Fetch all 2-digit sectors from comprehensive API
  const { data: sectors = [], isLoading: sectorsLoading } = useQuery<{code: string, title: string}[]>({
    queryKey: ['/api/naics/comprehensive/sectors'],
    queryFn: () => fetch('/api/naics/comprehensive/sectors').then(res => res.json()),
    enabled: true
  });

  // Fetch 6-digit industries for selected 2-digit sector from comprehensive database
  const { data: sectorIndustries = [], isLoading: industriesLoading } = useQuery<{code: string, title: string, level: number, parentCode?: string, multiplier?: {min: number, avg: number, max: number}}[]>({
    queryKey: ['/api/naics/comprehensive/by-sector', selectedSectorCode],
    queryFn: () => selectedSectorCode ? fetch(`/api/naics/comprehensive/by-sector/${encodeURIComponent(selectedSectorCode)}`).then(res => res.json()) : Promise.resolve([]),
    enabled: !!selectedSectorCode
  });

  const handleSectorChange = (sectorValue: string) => {
    // Parse the sector value to extract both code and title
    const sector = sectors.find(s => s.code === sectorValue);
    if (sector) {
      setSelectedSector(sector.title);
      setSelectedSectorCode(sector.code);
      // Reset industry selection when sector changes
      setFormData(prev => ({ 
        ...prev, 
        primarySector: sector.title,
        specificIndustry: ""
      }));
    }
  };

  const handleIndustryChange = (industryCode: string) => {
    // Find the selected industry to get its title
    const industry = sectorIndustries.find(i => i.code === industryCode);
    if (industry) {
      setFormData(prev => ({ 
        ...prev, 
        specificIndustry: industry.title,
        naicsCode: industryCode, // Store the 4-digit code
        sectorCode: selectedSectorCode // Store the 2-digit sector code
      }));
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
                <label className="block text-sm font-medium mb-2">Primary Sector *</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  value={selectedSectorCode}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  disabled={sectorsLoading}
                >
                  <option value="">{sectorsLoading ? 'Loading sectors...' : 'Select a sector...'}</option>
                  {sectors.map((sector) => (
                    <option key={sector.code} value={sector.code}>
                      {sector.code} – {sector.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Specific Industry</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  disabled={!selectedSectorCode || industriesLoading}
                  value={formData.naicsCode || ""}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                >
                  {!selectedSectorCode ? (
                    <option value="">First select a sector above...</option>
                  ) : industriesLoading ? (
                    <option value="">Loading industries...</option>
                  ) : (
                    <>
                      <option value="">Select your industry...</option>
                      {sectorIndustries.map(industry => (
                        <option key={industry.code} value={industry.code}>
                          {industry.title}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Description *</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-gray-900 bg-white"
                  placeholder="Describe your business operations, products/services, and target market..."
                  value={formData.businessDescription}
                  onChange={(e) => handleFormChange('businessDescription', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Years in Business</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="5"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleFormChange('yearsInBusiness', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Employees</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="25"
                    value={formData.numberOfEmployees}
                    onChange={(e) => handleFormChange('numberOfEmployees', e.target.value)}
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