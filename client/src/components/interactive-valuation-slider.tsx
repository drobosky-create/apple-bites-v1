import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight, Phone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ValuationAssessment } from "@shared/schema";

type OperationalGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export default function InteractiveValuationSlider() {
  // Fetch the most recent assessment data
  const { data: assessments, isLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments']
  });

  // Grade mapping functions
  const gradeToNumber = (grade: OperationalGrade): number => {
    switch (grade) {
      case 'A': return 4;
      case 'B': return 3;
      case 'C': return 2;
      case 'D': return 1;
      case 'F': return 0;
    }
  };

  const numberToGrade = (num: number): OperationalGrade => {
    switch (num) {
      case 4: return 'A';
      case 3: return 'B';
      case 2: return 'C';
      case 1: return 'D';
      default: return 'F';
    }
  };

  // Use most recent assessment data or defaults
  const latestAssessment = assessments?.[assessments.length - 1];
  
  // Ensure EBITDA is properly parsed from string to number
  const getEbitdaValue = (assessment: ValuationAssessment | undefined): number => {
    if (!assessment) return 1379841; // Default fallback
    
    const adjustedEbitda = assessment.adjustedEbitda;
    if (!adjustedEbitda) return 1379841;
    
    const parsed = typeof adjustedEbitda === 'string' ? parseFloat(adjustedEbitda) : adjustedEbitda;
    return !isNaN(parsed) && parsed > 0 ? parsed : 1379841;
  };
  
  const currentEbitda = getEbitdaValue(latestAssessment);
  const baseGrade: OperationalGrade = latestAssessment ? 
    (latestAssessment.overallScore?.charAt(0) as OperationalGrade || 'C') : 'C';

  const [sliderGrade, setSliderGrade] = useState<OperationalGrade>(baseGrade);
  const [showBooking, setShowBooking] = useState(false);

  // Handle slider change without auto-scrolling
  const handleSliderChange = (value: number[]) => {
    const newGrade = numberToGrade(value[0]);
    setSliderGrade(newGrade);
  };

  // Update slider when new data loads
  useEffect(() => {
    setSliderGrade(baseGrade);
  }, [baseGrade]);

  // EBITDA multiples based on operational grades
  const getMultipleForGrade = (grade: OperationalGrade): number => {
    // Using centralized multiplier scale for consistency
    const multipliers = {
      'A': 7.5, // Excellent Operations
      'B': 5.7, // Good Operations
      'C': 4.2, // Average Operations
      'D': 3.0, // Needs Improvement
      'F': 2.0  // At Risk
    };
    return multipliers[grade] || 4.2;
  };

  const calculateValuation = (grade: OperationalGrade): number => {
    const multiple = getMultipleForGrade(grade);
    return currentEbitda * multiple;
  };

  const currentValuation = calculateValuation(baseGrade);
  const sliderValuation = calculateValuation(sliderGrade);
  const potentialIncrease = sliderValuation - currentValuation;
  const percentageIncrease = currentValuation > 0 ? ((potentialIncrease / currentValuation) * 100) : 0;

  // Get multiples for display
  const currentMultiple = getMultipleForGrade(baseGrade);
  const sliderMultiple = getMultipleForGrade(sliderGrade);

  // Data for the comparison chart
  const chartData = [
    {
      category: 'Current',
      valuation: Math.round(currentValuation),
      multiple: currentMultiple.toFixed(1),
      grade: baseGrade
    },
    {
      category: 'Potential',
      valuation: Math.round(sliderValuation),
      multiple: sliderMultiple.toFixed(1),
      grade: sliderGrade
    }
  ];

  const getGradeCategory = (grade: OperationalGrade): { label: string; color: string; bgColor: string } => {
    switch (grade) {
      case 'A': return { label: "Excellent Operations", color: "text-green-800", bgColor: "bg-green-500" };
      case 'B': return { label: "Good Operations", color: "text-green-700", bgColor: "bg-green-400" };
      case 'C': return { label: "Average Operations", color: "text-slate-700", bgColor: "bg-slate-500" };
      case 'D': return { label: "Below Average", color: "text-red-700", bgColor: "bg-red-400" };
      case 'F': return { label: "Poor Operations", color: "text-red-800", bgColor: "bg-red-500" };
    }
  };

  const currentCategory = getGradeCategory(baseGrade);
  const sliderCategory = getGradeCategory(sliderGrade);

  useEffect(() => {
    if (gradeToNumber(sliderGrade) > gradeToNumber(baseGrade)) {
      const timer = setTimeout(() => setShowBooking(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowBooking(false);
    }
  }, [sliderGrade, baseGrade, gradeToNumber]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold text-[#0F172A] mb-4 tracking-wide font-smoothing-antialiased">
          Business Value Improvement Calculator
        </h2>
        <p className="text-lg sm:text-xl text-[#475569] leading-relaxed font-semibold">
          See how improving your business operations translates to increased valuation
        </p>
        {latestAssessment && (
          <p className="text-base sm:text-lg text-[#475569]/80 mt-3">
            Based on your recent assessment data
          </p>
        )}
      </div>
      {/* Current vs Potential Value Cards with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* Current Value Card */}
        <div className="bg-gradient-to-br from-white to-slate-50 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-900/5 border border-white/40 p-6 sm:p-8 value-card-hover relative overflow-hidden">
          {/* Subtle icon watermark */}
          <div className="absolute top-4 right-4 text-6xl opacity-10">💹</div>
          <div className="text-center relative z-10">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0F172A] mb-3 tracking-wide">Current Value</h3>
            <p className="text-base sm:text-lg text-[#475569] mb-6">Based on your Operational Grade of {baseGrade}</p>
            <div className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4 transition-all duration-300">
              ${currentValuation.toLocaleString()}
            </div>
            <div className="text-base sm:text-lg font-semibold text-[#475569] mb-4">
              {currentMultiple}x EBITDA Multiple
            </div>
            <Badge variant="secondary" className="inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-slate-500 px-4 py-2 text-sm font-medium text-[#2a2c37]">
              {currentCategory.label}
            </Badge>
          </div>
        </div>

        {/* Potential Value Card */}
        <div className={`bg-gradient-to-br from-white to-slate-50 backdrop-blur-xl rounded-2xl shadow-xl border p-6 sm:p-8 value-card-hover relative overflow-hidden ${
          sliderGrade !== baseGrade 
            ? 'shadow-green-500/20 border-green-200/50' 
            : 'shadow-slate-900/5 border-white/40'
        }`}>
          {/* Subtle icon watermark */}
          <div className="absolute top-4 right-4 text-6xl opacity-10">📈</div>
          <div className="text-center relative z-10">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0F172A] mb-3 tracking-wide">Potential Value</h3>
            <p className="text-base sm:text-lg text-[#475569] mb-6">With an Operational Grade of {sliderGrade}</p>
            <div className={`text-4xl sm:text-5xl font-bold mb-4 transition-all duration-300 ${
              sliderGrade !== baseGrade ? 'text-green-600' : 'text-[#0F172A]'
            }`}>
              ${sliderValuation.toLocaleString()}
            </div>
            <div className="text-base sm:text-lg font-semibold text-[#475569] mb-4">
              {sliderMultiple}x EBITDA Multiple
            </div>
            <Badge variant="secondary" className={`${sliderCategory.bgColor} text-white px-4 py-2 text-sm font-medium mb-4`}>
              {sliderCategory.label}
            </Badge>
            {sliderGrade !== baseGrade && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-[#475569] mb-2 font-medium">Adjust the slider below to explore your potential</p>
                {potentialIncrease > 0 && (
                  <div className="text-lg font-bold text-green-600">
                    +${potentialIncrease.toLocaleString()} ({percentageIncrease.toFixed(1)}% increase)
                  </div>
                )}
                {potentialIncrease < 0 && (
                  <div className="text-lg font-bold text-red-600">
                    ${Math.abs(potentialIncrease).toLocaleString()} ({Math.abs(percentageIncrease).toFixed(1)}% decrease)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Interactive Grade Slider with Argon Styling */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-900/5 border border-white/30 p-8 sm:p-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4 tracking-wide flex items-center justify-center gap-3">
            <TrendingUp className="h-8 w-8 text-[#3B82F6]" />
            Adjust Your Operational Grade
          </h3>
          <p className="text-lg sm:text-xl text-[#64748B] leading-relaxed font-medium">
            Select different operational grades to see how business improvements impact your valuation
          </p>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <p className="text-base sm:text-lg text-[#475569] mb-8 font-semibold">
              Click on any grade below to see how operational improvements impact your valuation
            </p>
            
            {/* Grade Selection Section */}
            <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/60 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/50">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-8 text-left">
                Business Value Distribution by Operational Grade
              </h3>
              
              {/* Current Grade Badge */}
              <div className="text-center mb-6">
                <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-pulse">
                  Current Grade: {baseGrade}
                </span>
              </div>

              {/* Instructions */}
              <div className="text-center mb-6">
                <p className="text-base sm:text-lg text-[#475569] font-semibold">
                  Click anywhere on the gradient scale below to explore different performance grades
                </p>
              </div>

              {/* Clean Gradient Bar with Purple-Blue Theme */}
              <div className="w-full h-4 bg-gradient-to-r from-purple-400 via-blue-500 to-blue-800 rounded overflow-hidden shadow-inner mt-4 mb-2"></div>
              
              {/* Professional Grade Markers with Improved Layout and Graphic Connectors */}
              <div className="grid grid-cols-5 gap-4 mt-6">
                {[
                  { grade: 'F', multiple: '2.0x', label: 'Poor' },
                  { grade: 'D', multiple: '3.0x', label: 'Below Avg' },
                  { grade: 'C', multiple: '4.2x', label: 'Average' },
                  { grade: 'B', multiple: '5.7x', label: 'Good' },
                  { grade: 'A', multiple: '7.5x', label: 'Excellent' }
                ].map((item, index) => (
                  <div key={item.grade} className="text-center relative group cursor-pointer" onClick={() => setSliderGrade(item.grade as OperationalGrade)}>
                    {/* Connector Line from Gradient Bar */}
                    <div className="w-0.5 h-8 bg-gray-300 mx-auto mb-2"></div>
                    
                    {/* Grade Circle with Purple-Blue Gradient */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${
                      item.grade === baseGrade 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white ring-4 ring-yellow-300' 
                        : item.grade === sliderGrade 
                          ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white ring-4 ring-purple-300'
                          : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300'
                    }`}>
                      {item.grade}
                    </div>
                    
                    {/* Multiple and Label */}
                    <div className="text-xs mt-1 text-gray-600 font-medium">{item.multiple}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>

                    {/* Professional Tooltip with Auto-Shifting */}
                    <div className={`absolute bottom-full mb-2 px-3 py-2 bg-white text-sm text-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap ${
                      item.grade === 'A' ? 'right-0' :
                      item.grade === 'F' ? 'left-0' :
                      'left-1/2 transform -translate-x-1/2'
                    }`}>
                      <div className="font-medium">Grade {item.grade}: {item.multiple}</div>
                      <div className="text-xs text-gray-600">{item.label} Operations</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Professional Details Card */}
              <div className="bg-white rounded-lg shadow-md p-4 mt-8 text-center">
                <div className="text-lg font-bold">Grade {sliderGrade}</div>
                <div className="text-gray-500 text-sm">
                  Multiple: <span className="font-medium text-blue-600">{sliderMultiple}x</span> • {sliderCategory.label} Operations
                </div>
                {sliderGrade === baseGrade && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                      CURRENT GRADE
                    </span>
                  </div>
                )}
                {sliderGrade !== baseGrade && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full ${
                      gradeToNumber(sliderGrade) > gradeToNumber(baseGrade) 
                        ? 'text-green-700 bg-green-50 border border-green-200' 
                        : 'text-red-700 bg-red-50 border border-red-200'
                    }`}>
                      {gradeToNumber(sliderGrade) > gradeToNumber(baseGrade) ? 'Improvement Scenario' : 'Decline Scenario'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Call to Action with Argon Styling */}
      {showBooking && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-200/50 p-8 animate-in slide-in-from-bottom duration-300">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4 tracking-wide">
              Ready to Unlock Your Business Value?
            </h3>
            <p className="text-lg sm:text-xl text-[#64748B] mb-6 font-medium">
              By improving your operational grade from {baseGrade} to {sliderGrade}, 
              you could add <strong className="text-green-600">${Math.round(potentialIncrease).toLocaleString()}</strong> to your business value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-[#3B82F6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')}
              >
                <Phone className="h-5 w-5 mr-3" />
                Get Your Customized Value Roadmap
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Educational Content with Argon Styling */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-900/5 border border-white/30 p-8 sm:p-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4 tracking-wide">
            How to Improve Your Operational Grade
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold border border-green-400">Grade A: 7.5x</div>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-3">💰 Financial Performance</h4>
            <p className="text-[#475569] leading-relaxed font-medium">Consistent profitability, strong cash flow management, and professional financial reporting</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold border border-blue-400">Grade B: 5.7x</div>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-3">⚙️ Operational Excellence</h4>
            <p className="text-[#475569] leading-relaxed font-medium">Streamlined processes, quality management systems, and scalable operations</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200/50 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold border border-yellow-400">Grade C: 4.2x</div>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-3">🎯 Market Position</h4>
            <p className="text-[#475569] leading-relaxed font-medium">Competitive differentiation, customer loyalty, and market share protection</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200/50 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold border border-red-400">Grades D-F: 2.0-3.0x</div>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-3">🛡️ Risk Management</h4>
            <p className="text-[#475569] leading-relaxed font-medium">Diversified revenue streams, reduced owner dependency, and operational stability</p>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#475569] mb-4">
            Want to See How Much More Your Business Could Be Worth?
          </h3>
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.location.href = '/assessment/free';
            }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#3B82F6] hover:bg-[#2563eb] text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Explore Your Full Valuation Roadmap 
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}