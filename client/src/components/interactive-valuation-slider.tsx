import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight, Phone } from "lucide-react";
import ModernGradeChart from './modern-grade-chart';
import OperationalGradeGauge from './OperationalGradeGauge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ValuationAssessment } from "@shared/schema";

type OperationalGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export default function InteractiveValuationSlider() {
  const [location] = useLocation();
  
  // Get assessment ID from URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const assessmentId = urlParams.get('assessmentId');
  
  // Fetch the assessment data
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

  // Use specific assessment if ID provided, otherwise use most recent
  const targetAssessment = assessmentId 
    ? assessments?.find(a => a.id.toString() === assessmentId)
    : assessments?.[assessments.length - 1];
  
  // Ensure EBITDA is properly parsed from string to number
  const getEbitdaValue = (assessment: ValuationAssessment | undefined): number => {
    if (!assessment) return 1379841; // Default fallback
    
    const adjustedEbitda = assessment.adjustedEbitda;
    if (!adjustedEbitda) return 1379841;
    
    const parsed = typeof adjustedEbitda === 'string' ? parseFloat(adjustedEbitda) : adjustedEbitda;
    return !isNaN(parsed) && parsed > 0 ? parsed : 1379841;
  };
  
  const currentEbitda = getEbitdaValue(targetAssessment);
  const baseGrade: OperationalGrade = targetAssessment ? 
    (targetAssessment.overallScore?.charAt(0) as OperationalGrade || 'C') : 'C';

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

  const getGradeInfo = (grade: 'A' | 'B' | 'C' | 'D' | 'F') => {
    const multiplier = getMultipleForGrade(grade);
    const colorMap = {
      'A': { bg: 'bg-green-500', border: 'border-green-400', gradient: 'from-green-50 to-emerald-50', borderColor: 'border-green-200/50' },
      'B': { bg: 'bg-blue-500', border: 'border-blue-400', gradient: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-200/50' },
      'C': { bg: 'bg-yellow-500', border: 'border-yellow-400', gradient: 'from-yellow-50 to-orange-50', borderColor: 'border-yellow-200/50' },
      'D': { bg: 'bg-orange-500', border: 'border-orange-400', gradient: 'from-orange-50 to-red-50', borderColor: 'border-orange-200/50' },
      'F': { bg: 'bg-red-500', border: 'border-red-400', gradient: 'from-red-50 to-pink-50', borderColor: 'border-red-200/50' }
    };
    return { 
      multiplier, 
      ...colorMap[grade],
      label: `Grade ${grade}: ${multiplier.toFixed(1)}x`
    };
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
        {targetAssessment && (
          <p className="text-base sm:text-lg text-[#475569]/80 mt-3">
            Based on your assessment data
          </p>
        )}
      </div>
      {/* Current vs Potential Value Cards with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* Current Value Card */}
        <div className="bg-gradient-to-br from-sky-100/40 to-blue-100/30 backdrop-blur-xl rounded-xl shadow-lg border border-slate-300 p-6 sm:p-8 text-center relative overflow-hidden">
          
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2 tracking-wide">
            Current Value 
            <span className="ml-3 inline-block px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded-full">
              You are here
            </span>
          </h3>
          <p className="text-base sm:text-lg text-slate-500 mb-4">Based on your Operational Grade of {baseGrade}</p>
          <div className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
            ${currentValuation.toLocaleString()}
          </div>
          <div className="text-base sm:text-lg font-semibold text-slate-600 mb-4">
            {currentMultiple}x EBITDA Multiple
          </div>
          <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-slate-200 text-slate-700">
            {currentCategory.label}
          </span>
        </div>

        {/* Potential Value Card */}
        <div className={`backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-900/5 border p-6 sm:p-8 value-card-hover relative overflow-hidden transition-all duration-300 ${
          sliderGrade !== baseGrade ? 
            (potentialIncrease > 0 ? 
              'bg-gradient-to-br from-green-50/60 to-emerald-50/40 border-green-200/60 ring-2 ring-green-400 ring-opacity-50 shadow-2xl shadow-green-200/50' : 
              'bg-gradient-to-br from-red-50/60 to-rose-50/40 border-red-200/60 ring-2 ring-red-400 ring-opacity-50 shadow-2xl shadow-red-200/50'
            )
            : 'bg-white/70 border-white/40'
        }`}>
          
          <div className="text-center relative z-10">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3 tracking-wide">Potential Value</h3>
            {sliderGrade !== baseGrade ? (
              <p className="text-base sm:text-lg text-slate-500 mb-4">
                Based on selected grade ({sliderGrade})
              </p>
            ) : (
              <p className="text-base sm:text-lg text-slate-500 mb-4">
                Based on selected grade ({sliderGrade})
              </p>
            )}
            <div className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
              ${sliderValuation.toLocaleString()}
            </div>
            <div className="text-base sm:text-lg font-semibold text-slate-600 mb-4">
              {sliderMultiple}x EBITDA Multiple
            </div>
            <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-slate-200 text-slate-700">
              {sliderCategory.label}
            </span>
            
            {/* POTENTIAL GAIN Display - Inside the card */}
            {sliderGrade !== baseGrade && (
              <div className={`mt-6 pt-4 border-t ${potentialIncrease > 0 ? 'border-green-200' : 'border-red-200'}`}>
                <div className="text-center">
                  <div className={`text-xs uppercase tracking-wider font-bold mb-2 ${
                    potentialIncrease > 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {potentialIncrease > 0 ? '💰 POTENTIAL GAIN' : '⚠️ POTENTIAL LOSS'}
                  </div>
                  <div className={`text-2xl font-black mb-2 ${
                    potentialIncrease > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {potentialIncrease > 0 ? '+' : '-'}${Math.abs(potentialIncrease).toLocaleString()}
                  </div>
                  <div className={`text-lg font-bold ${
                    potentialIncrease > 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {potentialIncrease > 0 ? '+' : '-'}{Math.abs(percentageIncrease).toFixed(1)}% {potentialIncrease > 0 ? 'increase' : 'decrease'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Combined Gauge and Grade Selection */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sm:p-8">
        {/* Gauge */}
        <div className="mb-8">
          <OperationalGradeGauge 
            grade={sliderGrade}
            title="Operational Grade Impact Analysis"
            animated={true}
          />
        </div>
        
        <h3 className="text-xl font-bold text-center text-slate-800 mb-6">
          Click any grade to see how operational improvements impact your business value
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {(['F', 'D', 'C', 'B', 'A'] as const).map((grade) => {
            const gradeInfo = getGradeInfo(grade);
            const isSelected = grade === sliderGrade;
            const isCurrent = grade === baseGrade;
            const valuation = calculateValuation(grade);
            
            return (
              <button
                key={grade}
                onClick={() => setSliderGrade(grade)}
                className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 shadow-md bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Current
                    </span>
                  </div>
                )}
                {isSelected && !isCurrent && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Selected Target
                    </span>
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${gradeInfo.bg} text-white font-bold text-2xl`}>
                  {grade}
                </div>
                
                
                <div className="text-sm text-slate-600 mb-2">
                  {gradeInfo.multiplier.toFixed(1)}x EBITDA
                </div>
                <div className="text-xs font-medium text-slate-700">
                  {grade === 'F' ? 'Poor' :
                   grade === 'D' ? 'Below Average' :
                   grade === 'C' ? 'Average' :
                   grade === 'B' ? 'Good' : 'Excellent'}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-slate-600">Current Grade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-slate-600">Selected Target</span>
          </div>
        </div>
        
        <p className="text-center text-sm text-slate-500 mt-4">
          Valuations based on EBITDA multiple × Hover for details
        </p>
      </div>
      {/* Call to Action */}
      {showBooking && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg border border-blue-200 p-8">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')}
              >
                <Phone className="h-5 w-5 mr-3" />
                Get Your Customized Value Roadmap
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Educational Content */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 sm:p-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4 tracking-wide">
            How to Improve Your Operational Grade
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Financial Performance - Grade A */}
          {(() => {
            const gradeInfo = getGradeInfo('A');
            return (
              <div className={`bg-gradient-to-br ${gradeInfo.gradient} rounded-lg p-6 border ${gradeInfo.borderColor} hover:shadow-md transition-all duration-200`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${gradeInfo.bg} bg-opacity-90 text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold ${gradeInfo.border}`}>
                    {gradeInfo.label}
                  </div>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-3">💰 Financial Performance</h4>
                <p className="text-[#475569] leading-relaxed font-medium">Consistent profitability, strong cash flow management, and professional financial reporting</p>
              </div>
            );
          })()}

          {/* Operational Excellence - Grade B */}
          {(() => {
            const gradeInfo = getGradeInfo('B');
            return (
              <div className={`bg-gradient-to-br ${gradeInfo.gradient} rounded-lg p-6 border ${gradeInfo.borderColor} hover:shadow-md transition-all duration-200`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${gradeInfo.bg} bg-opacity-90 text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold ${gradeInfo.border}`}>
                    {gradeInfo.label}
                  </div>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-3">⚙️ Operational Excellence</h4>
                <p className="text-[#475569] leading-relaxed font-medium">Streamlined processes, quality management systems, and scalable operations</p>
              </div>
            );
          })()}

          {/* Market Position - Grade C */}
          {(() => {
            const gradeInfo = getGradeInfo('C');
            return (
              <div className={`bg-gradient-to-br ${gradeInfo.gradient} rounded-lg p-6 border ${gradeInfo.borderColor} hover:shadow-md transition-all duration-200`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${gradeInfo.bg} bg-opacity-90 text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold ${gradeInfo.border}`}>
                    {gradeInfo.label}
                  </div>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-3">🎯 Market Position</h4>
                <p className="text-[#475569] leading-relaxed font-medium">Competitive differentiation, customer loyalty, and market share protection</p>
              </div>
            );
          })()}

          {/* Risk Management - Grades D-F */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-red-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold border-red-400">
                Grades D-F: {getMultipleForGrade('D').toFixed(1)}-{getMultipleForGrade('F').toFixed(1)}x
              </div>
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
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Explore Your Full Valuation Roadmap 
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}