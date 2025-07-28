import { useState, useEffect } from "react";



import { ArrowLeft, Shield, Star, Building2, TrendingUp, DollarSign, FileText, Calculator, Zap, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import calculateValuation from "@/utils/valuationEngine";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AICoachingTips from '@/components/AICoachingTips';

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

function GrowthExitAssessment() {
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

  const handlePaygateClick = () => {
    // Save assessment data to localStorage for later processing
    localStorage.setItem('growthExitAssessmentData', JSON.stringify(formData));
    
    // Open Apple Bites checkout link for Growth & Exit Assessment
    const checkoutLink = 'https://products.applebites.ai/product-details/product/686c2e0f5f2f1191edb09737';
    
    // Open payment link in new window/tab
    window.open(checkoutLink, '_blank');
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
      // NAICS code for industry-specific multipliers
      { id: 'naics-code', value: formData.naicsCode, valueDriver: 'Industry', weight: 0 },
      
      // Financial data
      { id: 'financial-1', value: parseFloat(formData.financials.annualRevenue) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'financial-2', value: parseFloat(formData.financials.costOfGoodsSold) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'financial-3', value: parseFloat(formData.financials.operatingExpenses) || 0, valueDriver: 'Financial Performance', weight: 0 },
      
      // Adjustments
      { id: 'adjustments-1', value: parseFloat(formData.adjustments.ownerSalary) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'adjustments-2', value: parseFloat(formData.adjustments.personalExpenses) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'adjustments-3', value: parseFloat(formData.adjustments.oneTimeExpenses) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'adjustments-4', value: parseFloat(formData.adjustments.otherAdjustments) || 0, valueDriver: 'Financial Performance', weight: 0 }
    ];
    
    // Add all 20 value driver responses
    Object.keys(formData.valueDrivers).forEach(driverId => {
      const value = formData.valueDrivers[driverId];
      if (value) {
        const question = valuationQuestions.find(q => q.id === driverId);
        if (question) {
          responses.push({
            id: driverId,
            valueDriver: question.valueDriver,
            weight: parseInt(value),
            value: parseInt(value)
          });
        }
      }
    });

    return calculateValuation(responses);
  };

  const getIndustryComparisonData = () => {
    const valuationResults = getValuationResults();
    const userMultiple = valuationResults.ebitda > 0 ? 
      (valuationResults.valuation.mean / valuationResults.ebitda) : 0;
    
    // Get industry multiplier from NAICS code
    const getIndustryMultiplier = (naicsCode) => {
      const naicsMultipliers = {
        // Construction (23)
        "236115": { low: 2.5, high: 5.0, avg: 3.8 },
        "236116": { low: 2.5, high: 5.0, avg: 3.8 },
        "236117": { low: 2.5, high: 5.0, avg: 3.8 },
        "236118": { low: 2.5, high: 5.0, avg: 3.8 },
        "236210": { low: 3.0, high: 6.0, avg: 4.5 },
        "236220": { low: 3.0, high: 6.0, avg: 4.5 },
        "237110": { low: 2.0, high: 4.5, avg: 3.3 },
        "237120": { low: 2.0, high: 4.5, avg: 3.3 },
        "237130": { low: 2.0, high: 4.5, avg: 3.3 },
        "237210": { low: 2.0, high: 4.5, avg: 3.3 },
        "237310": { low: 2.0, high: 4.5, avg: 3.3 },
        "237990": { low: 2.0, high: 4.5, avg: 3.3 },
        "238110": { low: 3.0, high: 6.0, avg: 4.5 },
        "238120": { low: 3.0, high: 6.0, avg: 4.5 },
        "238130": { low: 3.0, high: 6.0, avg: 4.5 },
        "238140": { low: 3.0, high: 6.0, avg: 4.5 },
        "238150": { low: 3.0, high: 6.0, avg: 4.5 },
        "238160": { low: 3.0, high: 6.0, avg: 4.5 },
        "238170": { low: 3.0, high: 6.0, avg: 4.5 },
        "238210": { low: 3.5, high: 7.0, avg: 5.3 },
        "238220": { low: 3.5, high: 7.0, avg: 5.3 },
        "238290": { low: 3.0, high: 6.0, avg: 4.5 },
        "238310": { low: 3.0, high: 6.0, avg: 4.5 },
        "238320": { low: 3.0, high: 6.0, avg: 4.5 },
        "238330": { low: 3.0, high: 6.0, avg: 4.5 },
        "238340": { low: 3.0, high: 6.0, avg: 4.5 },
        "238350": { low: 3.0, high: 6.0, avg: 4.5 },
        "238390": { low: 3.0, high: 6.0, avg: 4.5 },
        "238910": { low: 2.5, high: 5.0, avg: 3.8 },
        "238990": { low: 2.5, high: 5.0, avg: 3.8 },
        
        // Professional Services (54)
        "541110": { low: 4.0, high: 8.0, avg: 6.0 },
        "541191": { low: 4.0, high: 8.0, avg: 6.0 },
        "541199": { low: 4.0, high: 8.0, avg: 6.0 },
        "541211": { low: 5.0, high: 10.0, avg: 7.5 },
        "541213": { low: 4.0, high: 8.0, avg: 6.0 },
        "541214": { low: 4.0, high: 8.0, avg: 6.0 },
        "541219": { low: 4.0, high: 8.0, avg: 6.0 },
        "541310": { low: 3.5, high: 7.0, avg: 5.3 },
        "541320": { low: 3.5, high: 7.0, avg: 5.3 },
        "541330": { low: 3.5, high: 7.0, avg: 5.3 },
        "541340": { low: 3.5, high: 7.0, avg: 5.3 },
        "541350": { low: 3.5, high: 7.0, avg: 5.3 },
        "541360": { low: 3.5, high: 7.0, avg: 5.3 },
        "541370": { low: 3.5, high: 7.0, avg: 5.3 },
        "541380": { low: 3.5, high: 7.0, avg: 5.3 },
        "541410": { low: 4.5, high: 9.0, avg: 6.8 },
        "541420": { low: 4.0, high: 8.0, avg: 6.0 },
        "541430": { low: 4.0, high: 8.0, avg: 6.0 },
        "541490": { low: 4.0, high: 8.0, avg: 6.0 },
        "541511": { low: 5.0, high: 12.0, avg: 8.5 },
        "541512": { low: 5.0, high: 12.0, avg: 8.5 },
        "541513": { low: 4.0, high: 9.0, avg: 6.5 },
        "541519": { low: 4.0, high: 9.0, avg: 6.5 },
        "541611": { low: 4.0, high: 8.0, avg: 6.0 },
        "541612": { low: 4.0, high: 8.0, avg: 6.0 },
        "541613": { low: 4.0, high: 8.0, avg: 6.0 },
        "541614": { low: 4.0, high: 8.0, avg: 6.0 },
        "541618": { low: 4.0, high: 8.0, avg: 6.0 },
        "541620": { low: 3.5, high: 7.0, avg: 5.3 },
        "541690": { low: 3.5, high: 7.0, avg: 5.3 },
        "541711": { low: 3.0, high: 6.0, avg: 4.5 },
        "541712": { low: 3.0, high: 6.0, avg: 4.5 },
        "541720": { low: 3.0, high: 6.0, avg: 4.5 },
        "541810": { low: 4.0, high: 8.0, avg: 6.0 },
        "541820": { low: 4.0, high: 8.0, avg: 6.0 },
        "541830": { low: 4.0, high: 8.0, avg: 6.0 },
        "541840": { low: 4.0, high: 8.0, avg: 6.0 },
        "541850": { low: 3.5, high: 7.0, avg: 5.3 },
        "541860": { low: 4.0, high: 8.0, avg: 6.0 },
        "541870": { low: 4.0, high: 8.0, avg: 6.0 },
        "541890": { low: 4.0, high: 8.0, avg: 6.0 },
        "541910": { low: 4.0, high: 8.0, avg: 6.0 },
        "541921": { low: 4.5, high: 9.0, avg: 6.8 },
        "541922": { low: 4.0, high: 8.0, avg: 6.0 },
        "541930": { low: 3.5, high: 7.0, avg: 5.3 },
        "541940": { low: 4.0, high: 8.0, avg: 6.0 },
        "541990": { low: 3.5, high: 7.0, avg: 5.3 }
      };
      
      // Sector defaults if specific NAICS not found
      const sectorDefaults = {
        "11": { low: 3.0, high: 6.0, avg: 4.5 },
        "21": { low: 2.0, high: 4.0, avg: 3.0 },
        "22": { low: 3.0, high: 6.0, avg: 4.5 },
        "23": { low: 2.5, high: 5.5, avg: 4.0 },
        "31": { low: 2.5, high: 5.0, avg: 3.8 },
        "42": { low: 3.0, high: 6.0, avg: 4.5 },
        "44": { low: 2.0, high: 4.0, avg: 3.0 },
        "48": { low: 2.0, high: 4.5, avg: 3.3 },
        "51": { low: 4.0, high: 8.0, avg: 6.0 },
        "52": { low: 3.0, high: 6.0, avg: 4.5 },
        "53": { low: 3.5, high: 7.0, avg: 5.3 },
        "54": { low: 4.0, high: 8.0, avg: 6.0 },
        "55": { low: 4.0, high: 8.0, avg: 6.0 },
        "56": { low: 3.0, high: 6.0, avg: 4.5 },
        "61": { low: 3.0, high: 6.0, avg: 4.5 },
        "62": { low: 3.5, high: 7.0, avg: 5.3 },
        "71": { low: 2.5, high: 5.0, avg: 3.8 },
        "72": { low: 2.0, high: 4.0, avg: 3.0 },
        "81": { low: 2.5, high: 5.0, avg: 3.8 },
        "92": { low: 2.0, high: 4.0, avg: 3.0 }
      };
      
      if (naicsCode && naicsMultipliers[naicsCode]) {
        return naicsMultipliers[naicsCode];
      }
      
      if (naicsCode && naicsCode.length >= 2) {
        const sectorCode = naicsCode.substring(0, 2);
        if (sectorDefaults[sectorCode]) {
          return sectorDefaults[sectorCode];
        }
      }
      
      return { low: 2.0, high: 5.0, avg: 3.5 };
    };
    
    const industryMult = getIndustryMultiplier(formData.naicsCode);
    const selectedIndustry = sectorIndustries?.find(i => i.code === formData.naicsCode);
    
    return [
      {
        name: 'Industry Low',
        value: industryMult.low,
        fill: '#ef4444'
      },
      {
        name: 'Industry Average',
        value: industryMult.avg,
        fill: '#3b82f6'
      },
      {
        name: 'Your Business',
        value: Math.round(userMultiple * 10) / 10,
        fill: '#10b981'
      },
      {
        name: 'Industry High',
        value: industryMult.high,
        fill: '#8b5cf6'
      }
    ];
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

  const getValueDriversScores = () => {
    const categories = getValueDriversByCategory();
    const scores = {};
    
    Object.keys(categories).forEach(category => {
      const questions = categories[category];
      const totalScore = questions.reduce((sum, q) => sum + q.weight, 0);
      const avgScore = questions.length > 0 ? totalScore / questions.length : 0;
      scores[category] = avgScore;
    });
    
    return scores;
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
      <div >
        <div 
          
          style={{ width: `${progress}%` }}
        ></div>
        <div >
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
          <Card >
            <CardHeader >
              <div >
                <Building2  />
              </div>
              <CardTitle >Contact Information</CardTitle>
              <p >Let's start with your basic information</p>
            </CardHeader>
            <CardContent >
              <div >
                <div>
                  <label >First Name *</label>
                  <input 
                    type="text" 
                    
                    placeholder="John"
                  />
                </div>
                <div>
                  <label >Last Name *</label>
                  <input 
                    type="text" 
                    
                    placeholder="Smith"
                  />
                </div>
              </div>
              <div>
                <label >Email Address *</label>
                <input 
                  type="email" 
                  
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label >Company Name *</label>
                <input 
                  type="text" 
                  
                  placeholder="Your Company LLC"
                />
              </div>
              <div>
                <label >Phone Number</label>
                <input 
                  type="tel" 
                  
                  placeholder="(555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card >
            <CardHeader >
              <div >
                <TrendingUp  />
              </div>
              <CardTitle >Industry Classification</CardTitle>
              <p >Help us understand your business sector</p>
            </CardHeader>
            <CardContent >
              <div>
                <label >Primary Sector *</label>
                <select 
                  
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
                <label >Specific Industry</label>
                <select 
                  
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
                <label >Business Description *</label>
                <textarea 
                  
                  placeholder="Describe your business operations, products/services, and target market..."
                  value={formData.businessDescription}
                  onChange={(e) => handleFormChange('businessDescription', e.target.value)}
                />
              </div>
              <div >
                <div>
                  <label >Years in Business</label>
                  <input 
                    type="number" 
                    
                    placeholder="5"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleFormChange('yearsInBusiness', e.target.value)}
                  />
                </div>
                <div>
                  <label >Number of Employees</label>
                  <input 
                    type="number" 
                    
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
          <Card >
            <CardHeader >
              <div >
                <DollarSign  />
              </div>
              <CardTitle >Financial Information</CardTitle>
              <p >Provide your key financial metrics</p>
            </CardHeader>
            <CardContent >
              <div>
                <label >Annual Revenue (Last 12 Months) *</label>
                <input 
                  type="number" 
                  value={formData.financials.annualRevenue}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    financials: { ...prev.financials, annualRevenue: e.target.value }
                  }))}
                  
                  placeholder="1000000"
                />
              </div>
              <div>
                <label >Cost of Goods Sold (COGS)</label>
                <input 
                  type="number" 
                  value={formData.financials.costOfGoodsSold}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    financials: { ...prev.financials, costOfGoodsSold: e.target.value }
                  }))}
                  
                  placeholder="400000"
                />
              </div>
              <div>
                <label >Total Operating Expenses *</label>
                <input 
                  type="number" 
                  value={formData.financials.operatingExpenses}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    financials: { ...prev.financials, operatingExpenses: e.target.value }
                  }))}
                  
                  placeholder="350000"
                />
              </div>
              <div >
                <div >
                  <Calculator  />
                  <span >Calculated EBITDA</span>
                </div>
                <div >
                  ${calculateEBITDA().toLocaleString()}
                </div>
                <p >This will be refined with your adjustments</p>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card >
            <CardHeader >
              <div >
                <Zap  />
              </div>
              <CardTitle >EBITDA Adjustments</CardTitle>
              <p >Normalize your earnings for valuation</p>
            </CardHeader>
            <CardContent >
              <div>
                <label >Owner's Salary Above Market Rate</label>
                <input 
                  type="number" 
                  value={formData.adjustments.ownerSalary}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, ownerSalary: e.target.value }
                  }))}
                  
                  placeholder="50000"
                />
              </div>
              <div>
                <label >Personal Expenses Run Through Business</label>
                <input 
                  type="number" 
                  value={formData.adjustments.personalExpenses}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, personalExpenses: e.target.value }
                  }))}
                  
                  placeholder="25000"
                />
              </div>
              <div>
                <label >One-Time Expenses</label>
                <input 
                  type="number" 
                  value={formData.adjustments.oneTimeExpenses}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, oneTimeExpenses: e.target.value }
                  }))}
                  
                  placeholder="15000"
                />
              </div>
              <div>
                <label >Other Adjustments</label>
                <input 
                  type="number" 
                  value={formData.adjustments.otherAdjustments}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, otherAdjustments: e.target.value }
                  }))}
                  
                  placeholder="10000"
                />
              </div>
              <div >
                <div >
                  <TrendingUp  />
                  <span >Adjusted EBITDA</span>
                </div>
                <div >
                  ${calculateAdjustedEBITDA().toLocaleString()}
                </div>
                <p >Ready for value driver analysis</p>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card >
            <CardHeader >
              <div >
                <Star  />
              </div>
              <CardTitle >Growth & Exit Value Drivers</CardTitle>
              <p >Answer these questions to assess your business value</p>
            </CardHeader>
            <CardContent >
              {/* Dynamic comprehensive questionnaire */}
              {valuationQuestions.map((question, index) => (
                <div key={question.id} >
                  <div>
                    <label >
                      {question.question}
                    </label>
                  </div>
                  <div >
                    {question.options.map((option, optionIndex) => (
                      <label key={`${question.id}-${optionIndex}`} >
                        <input
                          type="radio"
                          name={question.id}
                          value={question.weights[optionIndex].toString()}
                          checked={formData.valueDrivers[question.id] === question.weights[optionIndex].toString()}
                          onChange={(e) => handleValueDriverChange(question.id, e.target.value)}
                          
                        />
                        <span >{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Progress indicator */}
              <div >
                <div >
                  <Calculator  />
                  <span >
                    Progress: {Object.values(formData.valueDrivers).filter(v => v !== "").length} of {valuationQuestions.length} questions completed
                  </span>
                </div>
                <div >
                  <div 
                    
                    style={{ width: `${(Object.values(formData.valueDrivers).filter(v => v !== "").length / valuationQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Real-time Valuation Preview using Valuation Engine */}
              <div >
                <div >
                  <Calculator  />
                  <span >Live Valuation Analysis</span>
                </div>
                {(() => {
                  const valuationResults = getValuationResults();
                  return (
                    <>
                      <div >
                        <div>
                          <span >Overall Score:</span>
                          <div >{valuationResults.overallScore}/100</div>
                        </div>
                        <div>
                          <span >Adjusted EBITDA:</span>
                          <div >${valuationResults.ebitda?.toLocaleString() || "0"}</div>
                        </div>
                        <div>
                          <span >Value Range:</span>
                          <div >
                            ${valuationResults.valuation?.low?.toLocaleString() || "0"} - ${valuationResults.valuation?.high?.toLocaleString() || "0"}
                          </div>
                        </div>
                      </div>
                      <div >
                        <span >Estimated Business Value:</span>
                        <div >
                          ${valuationResults.valuation?.mean?.toLocaleString() || "0"}
                        </div>
                        <p >
                          Based on comprehensive financial and strategic analysis
                        </p>
                      </div>
                      {valuationResults.recommendations && valuationResults.recommendations.length > 0 && (
                        <div >
                          <span >Improvement Areas:</span>
                          <ul >
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
              <div >
                <div >
                  <span >Assessment Progress</span>
                  <span >{Object.values(formData.valueDrivers).filter(v => v !== "").length}/{valuationQuestions.length} completed</span>
                </div>
                <div >
                  <div 
                    
                    style={{ width: `${Math.min(100, (Object.values(formData.valueDrivers).filter(v => v !== "").length / valuationQuestions.length) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card >
            <CardHeader >
              <div >
                <FileText  />
              </div>
              <CardTitle >Complete Your Assessment</CardTitle>
              <p >Review and finalize your strategic valuation</p>
            </CardHeader>
            <CardContent >
              {(() => {
                const valuationResults = getValuationResults();
                const selectedIndustry = sectorIndustries?.find(i => i.code === formData.naicsCode);
                const userMultiple = valuationResults.ebitda > 0 ? 
                  (valuationResults.valuation.mean / valuationResults.ebitda) : 0;
                
                return (
                  <>
                    <div >
                      <h3 >Assessment Summary</h3>
                      <div >
                        <div>
                          <span >Adjusted EBITDA:</span>
                          <div >${valuationResults.ebitda?.toLocaleString() || "0"}</div>
                        </div>
                        <div>
                          <span >Your Multiple:</span>
                          <div >{userMultiple.toFixed(1)}x</div>
                        </div>
                        <div>
                          <span >Estimated Value:</span>
                          <div >${valuationResults.valuation?.mean?.toLocaleString() || "0"}</div>
                        </div>
                        <div>
                          <span >Value Range:</span>
                          <div >${valuationResults.valuation?.low?.toLocaleString() || "0"} - ${valuationResults.valuation?.high?.toLocaleString() || "0"}</div>
                        </div>
                      </div>
                    </div>
                    {/* Industry Comparison Chart */}
                    <div >
                      <div >
                        <h3 >Estimated Business Value</h3>
                        <div >
                          <p>Low Estimate: <strong >${valuationResults.valuation?.low?.toLocaleString() || "0"}</strong></p>
                          <p>High Estimate: <strong >${valuationResults.valuation?.high?.toLocaleString() || "0"}</strong></p>
                          <p>Mean Estimate: <strong >${valuationResults.valuation?.mean?.toLocaleString() || "0"}</strong></p>
                        </div>
                      </div>
                      
                      <div >
                        <p >
                          Industry: {selectedIndustry?.title || `${formData.naicsCode} – Industry Classification`}
                        </p>
                        <h4 >Industry-Based Valuation Range</h4>
                        
                        {/* Gradient Bar with Indicators */}
                        <div >
                          <div 
                            
                            style={{
                              background: 'linear-gradient(to right, #f44336 0%, #ff9800 25%, #ffc107 50%, #4caf50 75%, #2e7d32 100%)'
                            }}
                          ></div>
                          
                          {/* Indicators */}
                          {(() => {
                            const industryMult = getIndustryComparisonData().find(d => d.name === 'Industry Average')?.value || 4.0;
                            const userPos = Math.min(Math.max(((userMultiple - 2) / (6 - 2)) * 100, 0), 100);
                            const avgPos = Math.min(Math.max(((industryMult - 2) / (6 - 2)) * 100, 0), 100);
                            const strategicPos = 80; // Strategic target at 80% position
                            
                            return (
                              <>
                                {/* You indicator */}
                                <div 
                                  
                                  style={{ left: `${userPos}%` }}
                                >
                                  <div ></div>
                                  <div >
                                    ▲ You
                                  </div>
                                </div>
                                
                                {/* Average indicator */}
                                <div 
                                  
                                  style={{ left: `${avgPos}%` }}
                                >
                                  <div ></div>
                                  <div >
                                    Avg
                                  </div>
                                </div>
                                
                                {/* Strategic indicator */}
                                <div 
                                  
                                  style={{ left: `${strategicPos}%` }}
                                >
                                  <div ></div>
                                  <div >
                                    Target
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        
                        {/* Range Labels */}
                        <div >
                          <span>Low: 2.0x</span>
                          <span>Avg: {getIndustryComparisonData().find(d => d.name === 'Industry Average')?.value}x</span>
                          <span>High: 6.0x</span>
                        </div>
                      </div>
                      
                      {/* Value Driver Breakdown */}
                      <div >
                        <h4 >Value Driver Breakdown</h4>
                        <div >
                          {(() => {
                            const driverScores = getValueDriversScores();
                            const driverNames = {
                              'Financial Performance': 'Financial Performance',
                              'Growth Potential': 'Growth Potential', 
                              'Market Position': 'Market Position',
                              'Operational Excellence': 'Operational Excellence'
                            };
                            
                            return Object.entries(driverScores).map(([driver, score]) => {
                              const percentage = Math.round((score / 5) * 100);
                              const getBarColor = (pct) => {
                                if (pct >= 75) return 'bg-green-500';
                                if (pct >= 50) return 'bg-blue-500';
                                return 'bg-red-500';
                              };
                              
                              return (
                                <div key={driver} >
                                  <div >
                                    <span >
                                      {driverNames[driver] || driver}
                                    </span>
                                    <span >
                                      {percentage}%
                                    </span>
                                  </div>
                                  <div >
                                    <div 
                                      className={`h-full ${getBarColor(percentage)} transition-all duration-300`}
                                      style={{ width: `${Math.max(percentage, 5)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                      
                      {/* Key Opportunities */}
                      <div >
                        <h4 >Key Opportunities to Improve</h4>
                        <ul >
                          <li>• Enhance your recurring revenue through contracts or subscriptions</li>
                          <li>• Clarify what makes your offering unique or defensible</li>
                          <li>• Explore new geographies or client segments to drive growth</li>
                        </ul>
                      </div>
                    </div>
                    {/* AI Coaching Tips */}
                    <AICoachingTips 
                      financialData={{
                        revenue: parseFloat(formData.financials?.annualRevenue) || 0,
                        ebitda: calculateEBITDA(),
                        adjustedEbitda: calculateAdjustedEBITDA(),
                        naicsCode: formData.naicsCode || '',
                        industryTitle: selectedIndustry?.title || 'Industry Classification',
                        valueDriverScores: getValueDriversScores(),
                        userMultiple: userMultiple,
                        industryAverage: getIndustryComparisonData().find(d => d.name === 'Industry Average')?.value || 4.0,
                        companySize: parseFloat(formData.financials?.annualRevenue || '0') > 10000000 ? 'large' : 
                                   parseFloat(formData.financials?.annualRevenue || '0') > 1000000 ? 'medium' : 'small',
                        businessAge: formData.contact?.foundingYear ? `${new Date().getFullYear() - parseInt(formData.contact.foundingYear)} years` : undefined,
                        employeeCount: parseInt(formData.contact?.employeeCount || '0') || undefined
                      }}
                    />
                  </>
                );
              })()}
              
              <div>
                <label >Additional Comments</label>
                <textarea 
                  
                  placeholder="Any additional information about your business..."
                />
              </div>

              <div >
                <Button 
                  onClick={handlePaygateClick}
                  
                >
                  Get Growth & Exit Assessment - $795
                </Button>
                <p >
                  Secure payment processed by Stripe • Includes 60-minute Discovery Call
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div >
      <div >
        {/* Header */}
        <div >
          <Button 
            variant="ghost" 
            onClick={handleBack}
            
          >
            <ArrowLeft  />
            Back to Home
          </Button>
          
          <div >
            <Shield  />
            <Badge >Secure Assessment</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div >
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            
          >
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              
            >
              Continue
            </Button>
          ) : (
            <div >
              <FileText  />
              Complete assessment above
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrowthExitAssessment;