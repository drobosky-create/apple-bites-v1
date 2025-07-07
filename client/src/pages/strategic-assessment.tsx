import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Star, Building2, TrendingUp, DollarSign, FileText, Calculator, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import calculateValuation from "@/utils/valuationEngine";

// Type definitions for NAICS data
interface NAICSIndustry {
  code: string;
  title: string;
  label: string;
  multiplier: {
    min: number;
    avg: number;
    max: number;
  };
  level: number;
  sectorCode: string;
}

interface NAICSSector {
  code: string;
  title: string;
}

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
    numberOfEmployees: "",
    financials: {
      annualRevenue: "",
      costOfGoodsSold: "",
      operatingExpenses: ""
    },
    adjustments: {
      ownerSalary: "",
      personalExpenses: "",
      oneTimeExpenses: "",
      otherAdjustments: ""
    },
    valueDrivers: {
      "driver-financial-performance-1": "",
      "driver-financial-performance-2": "",
      "driver-recurring-revenue-1": "",
      "driver-recurring-revenue-2": "",
      "driver-growth-potential-1": "",
      "driver-growth-potential-2": "",
      "driver-owner-dependency-1": "",
      "driver-owner-dependency-2": "",
      "driver-revenue-diversity-1": "",
      "driver-revenue-diversity-2": "",
      "driver-customer-satisfaction-1": "",
      "driver-customer-satisfaction-2": "",
      "driver-operational-independence-1": "",
      "driver-operational-independence-2": "",
      "driver-scalability-1": "",
      "driver-scalability-2": "",
      "driver-team-talent-1": "",
      "driver-team-talent-2": "",
      "driver-differentiation-1": "",
      "driver-differentiation-2": ""
    }
  });
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedSectorCode, setSelectedSectorCode] = useState("");
  const totalSteps = 6;

  // Comprehensive Value Driver Questions (10 drivers, 2 questions each)
  const valuationQuestions = [
    {
      id: "driver-financial-performance-1",
      question: "How profitable is your business compared to industry benchmarks?",
      options: ["Not profitable", "Below average", "Average", "Above average", "Top-tier"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Financial Performance"
    },
    {
      id: "driver-financial-performance-2",
      question: "What is your adjusted net profit margin?",
      options: ["< 5%", "5–10%", "11–15%", "16–20%", "> 20%"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Financial Performance"
    },
    {
      id: "driver-recurring-revenue-1",
      question: "What percentage of your revenue is recurring (contracts, subscriptions)?",
      options: ["0%", "1–25%", "26–50%", "51–75%", "76–100%"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Recurring Revenue"
    },
    {
      id: "driver-recurring-revenue-2",
      question: "How secure are your recurring revenue contracts?",
      options: ["No contracts", "Month-to-month", "Annual, not auto-renew", "Annual with auto-renew", "Multi-year, auto-renew"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Recurring Revenue"
    },
    {
      id: "driver-growth-potential-1",
      question: "How much do you expect your revenue to grow in the next 12 months?",
      options: ["Decrease", "Flat", "1–10%", "11–30%", "Over 30%"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Growth Potential"
    },
    {
      id: "driver-growth-potential-2",
      question: "How many new customers can you reasonably acquire this year?",
      options: ["None", "1–10", "11–50", "51–100", "Over 100"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Growth Potential"
    },
    {
      id: "driver-owner-dependency-1",
      question: "Could your business run for 90 days without your involvement?",
      options: ["No", "Barely", "Somewhat", "Mostly", "Yes, seamlessly"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Owner Dependency"
    },
    {
      id: "driver-owner-dependency-2",
      question: "How often do customers request to work directly with the owner?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Owner Dependency"
    },
    {
      id: "driver-revenue-diversity-1",
      question: "What % of your revenue comes from your single largest customer?",
      options: [">50%", "26–50%", "11–25%", "6–10%", "<5%"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Revenue Diversity"
    },
    {
      id: "driver-revenue-diversity-2",
      question: "How many different customer segments do you serve?",
      options: ["1", "2", "3", "4", "5 or more"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Revenue Diversity"
    },
    {
      id: "driver-customer-satisfaction-1",
      question: "What percentage of your customers are 'very satisfied'?",
      options: ["<25%", "25–50%", "51–75%", "76–90%", ">90%"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Customer Satisfaction"
    },
    {
      id: "driver-customer-satisfaction-2",
      question: "How often do customers refer others to your company?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Customer Satisfaction"
    },
    {
      id: "driver-operational-independence-1",
      question: "How standardized are your internal processes and SOPs?",
      options: ["None exist", "Some documentation", "Basic SOPs exist", "Well-documented", "Automated and trained"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Operational Independence"
    },
    {
      id: "driver-operational-independence-2",
      question: "How easily can you delegate critical business functions?",
      options: ["Impossible", "Very difficult", "Somewhat difficult", "Fairly easy", "Very easy"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Operational Independence"
    },
    {
      id: "driver-scalability-1",
      question: "If demand grew 5x, how easily could your company fulfill it?",
      options: ["Impossible", "Very difficult", "Fairly difficult", "Fairly easy", "Very easy"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Scalability"
    },
    {
      id: "driver-scalability-2",
      question: "How easily could your business be replicated in another market?",
      options: ["Impossible", "Very difficult", "Fairly difficult", "Fairly easy", "Very easy"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Scalability"
    },
    {
      id: "driver-team-talent-1",
      question: "How strong is your current leadership team?",
      options: ["None", "1 manager", "A few informal leaders", "Defined department heads", "Full team with long-term incentives"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Team & Talent"
    },
    {
      id: "driver-team-talent-2",
      question: "How difficult would it be to replace your top-performing team member?",
      options: ["Impossible", "Very difficult", "Fairly difficult", "Fairly easy", "Very easy"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Team & Talent"
    },
    {
      id: "driver-differentiation-1",
      question: "How unique is your core product or service?",
      options: ["Commodity", "Some competitors", "Moderately unique", "Very unique", "One-of-a-kind"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Differentiation & Brand Strength"
    },
    {
      id: "driver-differentiation-2",
      question: "How well recognized is your brand in the market?",
      options: ["Not at all", "Somewhat", "Recognized locally", "Known regionally", "Category leader"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Differentiation & Brand Strength"
    }
  ];

  // Fetch all 2-digit sectors from comprehensive API
  const { data: sectors = [], isLoading: sectorsLoading } = useQuery<NAICSSector[]>({
    queryKey: ['/api/naics/comprehensive/sectors'],
    queryFn: () => fetch('/api/naics/comprehensive/sectors').then(res => res.json()),
    enabled: true
  });

  // Fetch 6-digit industries for selected 2-digit sector from comprehensive database
  const { data: sectorIndustries = [], isLoading: industriesLoading } = useQuery<NAICSIndustry[]>({
    queryKey: ['/api/naics/comprehensive/by-sector', selectedSectorCode],
    queryFn: () => selectedSectorCode ? fetch(`/api/naics/comprehensive/by-sector/${encodeURIComponent(selectedSectorCode)}`).then(res => res.json()) : Promise.resolve([]),
    enabled: !!selectedSectorCode
  });

  // Debug logging for industries
  useEffect(() => {
    if (sectorIndustries && sectorIndustries.length > 0) {
      console.log('Fetched industries for sector', selectedSectorCode, ':', sectorIndustries.length, 'industries');
    }
  }, [sectorIndustries, selectedSectorCode]);

  const handleSectorChange = (sectorValue: string) => {
    // Parse the sector value to extract both code and title
    const sector = sectors.find(s => s.code === sectorValue);
    if (sector) {
      console.log('Selected sector:', sector.code, sector.title);
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
    const industry = sectorIndustries.find((i: NAICSIndustry) => i.code === industryCode);
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

  // Helper functions for Value Drivers step
  const handleValueDriverChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      valueDrivers: {
        ...prev.valueDrivers,
        [questionId]: value
      }
    }));
  };

  const calculateBaseMultiplier = () => {
    if (!formData.naicsCode) return "4.0";
    
    // This would typically fetch from the comprehensive NAICS database
    // For now, return a realistic base multiplier
    return "4.5";
  };

  const calculateTotalScore = () => {
    if (!formData.valueDrivers) return 0;
    
    const scores = Object.values(formData.valueDrivers);
    return scores.reduce((sum: number, score: string) => {
      const numericScore = parseInt(score) || 0;
      return sum + numericScore;
    }, 0);
  };

  const calculateMultiplierAdjustment = () => {
    const totalScore = calculateTotalScore();
    const maxScore = 20; // 4 questions × 5 points each
    const scorePercentage = totalScore / maxScore;
    
    // Convert percentage to multiplier adjustment
    // 0% = -1.0x, 50% = 0.0x, 100% = +1.0x
    const adjustment = (scorePercentage - 0.5) * 2;
    return adjustment.toFixed(1);
  };

  const calculateFinalMultiplier = () => {
    const baseMultiplier = parseFloat(calculateBaseMultiplier());
    const adjustment = parseFloat(calculateMultiplierAdjustment());
    const finalMultiplier = baseMultiplier + adjustment;
    return Math.max(finalMultiplier, 1.0).toFixed(1);
  };

  const getValuationResults = () => {
    // Prepare responses array for valuation engine
    const responses = [
      // Financial data
      { id: 'financial-1', value: parseFloat(formData.financials.annualRevenue) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'financial-2', value: parseFloat(formData.financials.costOfGoodsSold) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'financial-3', value: parseFloat(formData.financials.operatingExpenses) || 0, valueDriver: 'Financial Performance', weight: 0 },
      
      // Adjustments
      { id: 'adjustments-1', value: parseFloat(formData.adjustments.ownerSalary) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'adjustments-2', value: parseFloat(formData.adjustments.personalExpenses) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'adjustments-3', value: parseFloat(formData.adjustments.oneTimeExpenses) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'adjustments-4', value: parseFloat(formData.adjustments.otherAdjustments) || 0, valueDriver: 'Financial Performance', weight: 0 },
      
      // Value drivers
      { id: 'driver-financial-performance-1', valueDriver: 'Financial Performance', weight: parseInt(formData.valueDrivers.financialPerformance) || 0 },
      { id: 'driver-recurring-revenue-1', valueDriver: 'Recurring Revenue', weight: parseInt(formData.valueDrivers.recurringRevenue) || 0 },
      { id: 'driver-growth-potential-1', valueDriver: 'Growth Potential', weight: parseInt(formData.valueDrivers.growthPotential) || 0 },
      { id: 'driver-owner-dependency-1', valueDriver: 'Owner Dependency', weight: parseInt(formData.valueDrivers.ownerDependency) || 0 }
    ];

    return calculateValuation(responses);
  };

  const getValueDriversProgress = () => {
    if (!formData.valueDrivers) return 0;
    return Object.values(formData.valueDrivers).filter(val => val && val.length > 0).length;
  };

  const getValueDriversByCategory = () => {
    const categories = {};
    valuationQuestions.forEach(question => {
      if (!categories[question.valueDriver]) {
        categories[question.valueDriver] = [];
      }
      categories[question.valueDriver].push({
        id: question.id,
        question: question.question,
        value: formData.valueDrivers[question.id] || "",
        weight: parseInt(formData.valueDrivers[question.id]) || 0
      });
    });
    return categories;
  };

  const calculateEBITDA = () => {
    const revenue = parseFloat(formData.financials.annualRevenue) || 0;
    const cogs = parseFloat(formData.financials.costOfGoodsSold) || 0;
    const opex = parseFloat(formData.financials.operatingExpenses) || 0;
    return revenue - cogs - opex;
  };

  const calculateAdjustedEBITDA = () => {
    const baseEBITDA = calculateEBITDA();
    const ownerSalary = parseFloat(formData.adjustments.ownerSalary) || 0;
    const personalExpenses = parseFloat(formData.adjustments.personalExpenses) || 0;
    const oneTimeExpenses = parseFloat(formData.adjustments.oneTimeExpenses) || 0;
    const otherAdjustments = parseFloat(formData.adjustments.otherAdjustments) || 0;
    
    return baseEBITDA + ownerSalary + personalExpenses + oneTimeExpenses + otherAdjustments;
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
                      {sectorIndustries.map((industry: NAICSIndustry) => (
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
                  value={formData.financials.annualRevenue}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    financials: { ...prev.financials, annualRevenue: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cost of Goods Sold (COGS)</label>
                <input 
                  type="number" 
                  value={formData.financials.costOfGoodsSold}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    financials: { ...prev.financials, costOfGoodsSold: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="400000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Operating Expenses *</label>
                <input 
                  type="number" 
                  value={formData.financials.operatingExpenses}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    financials: { ...prev.financials, operatingExpenses: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="350000"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calculator className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Calculated EBITDA</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${calculateEBITDA().toLocaleString()}
                </div>
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
                  value={formData.adjustments.ownerSalary}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, ownerSalary: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Personal Expenses Run Through Business</label>
                <input 
                  type="number" 
                  value={formData.adjustments.personalExpenses}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, personalExpenses: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">One-Time Expenses</label>
                <input 
                  type="number" 
                  value={formData.adjustments.oneTimeExpenses}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, oneTimeExpenses: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="15000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Other Adjustments</label>
                <input 
                  type="number" 
                  value={formData.adjustments.otherAdjustments}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, otherAdjustments: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10000"
                />
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">Adjusted EBITDA</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${calculateAdjustedEBITDA().toLocaleString()}
                </div>
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
              <p className="text-gray-600">Answer these questions to assess your business value</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dynamic comprehensive questionnaire */}
              {valuationQuestions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.valueDriver}</h3>
                    <label className="block text-sm font-medium text-gray-700">
                      {question.question}
                    </label>
                  </div>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={`${question.id}-${optionIndex}`} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={question.weights[optionIndex].toString()}
                          checked={formData.valueDrivers[question.id] === question.weights[optionIndex].toString()}
                          onChange={(e) => handleValueDriverChange(question.id, e.target.value)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Progress indicator */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calculator className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Progress: {Object.values(formData.valueDrivers).filter(v => v !== "").length} of {valuationQuestions.length} questions completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(Object.values(formData.valueDrivers).filter(v => v !== "").length / valuationQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Real-time Valuation Preview using Valuation Engine */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border">
                <div className="flex items-center mb-3">
                  <Calculator className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="font-medium text-indigo-900">Live Valuation Analysis</span>
                </div>
                {(() => {
                  const valuationResults = getValuationResults();
                  return (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Overall Score:</span>
                          <div className="text-lg font-bold text-indigo-600">{valuationResults.overallScore}/100</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Adjusted EBITDA:</span>
                          <div className="text-lg font-bold text-purple-600">${valuationResults.ebitda?.toLocaleString() || "0"}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Value Range:</span>
                          <div className="text-lg font-bold text-green-600">
                            ${valuationResults.valuation?.low?.toLocaleString() || "0"} - ${valuationResults.valuation?.high?.toLocaleString() || "0"}
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-indigo-200">
                        <span className="text-sm text-gray-600">Estimated Business Value:</span>
                        <div className="text-3xl font-bold text-green-600">
                          ${valuationResults.valuation?.mean?.toLocaleString() || "0"}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Based on comprehensive financial and strategic analysis
                        </p>
                      </div>
                      {valuationResults.recommendations && valuationResults.recommendations.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-indigo-200">
                          <span className="text-sm font-medium text-indigo-900">Improvement Areas:</span>
                          <ul className="text-xs text-gray-600 mt-1 space-y-1">
                            {valuationResults.recommendations.slice(0, 2).map((rec, idx) => (
                              <li key={idx}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
              
              {/* Progress Indicator */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Assessment Progress</span>
                  <span className="text-sm text-blue-700">{getValueDriversProgress()}/4 completed</span>
                </div>
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(getValueDriversProgress() / 4) * 100}%` }}
                  />
                </div>
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