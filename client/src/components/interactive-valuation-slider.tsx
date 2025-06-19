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
    <div className="max-w-4xl mx-auto p-2 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mb-2">
          Business Value Improvement Calculator
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          See how improving your business operations translates to increased valuation
        </p>
        {latestAssessment && (
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Based on your recent assessment data
          </p>
        )}
      </div>

      {/* Current vs Potential Value Cards with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="border-2 border-slate-200 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Current Value</CardTitle>
            <CardDescription className="text-sm text-slate-600">Based on your Operational Grade of {baseGrade}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2 transition-all duration-300">
              ${Math.round(currentValuation).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 mb-2">
              {currentMultiple.toFixed(1)}x EBITDA Multiple
            </div>
            <Badge variant="secondary" className={`${currentCategory.bgColor} text-white`}>
              {currentCategory.label}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#f5c842] bg-white transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-slate-900">Potential Value</CardTitle>
            <CardDescription className="text-sm text-slate-600">
              With an Operational Grade of {sliderGrade}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2 transition-all duration-300">
              ${Math.round(sliderValuation).toLocaleString()}
            </div>
            <div className="text-sm text-blue-700 mb-2">
              {sliderMultiple.toFixed(1)}x EBITDA Multiple
            </div>
            <Badge variant="secondary" className={`${sliderCategory.bgColor} text-white`}>
              {sliderCategory.label}
            </Badge>
            <div className="mt-3 p-3 bg-white rounded-lg border min-h-[80px] flex flex-col justify-center">
              {potentialIncrease !== 0 ? (
                <>
                  <div className="text-sm text-gray-600">
                    {potentialIncrease > 0 ? 'Potential Increase' : 'Potential Decrease'}
                  </div>
                  <div className={`text-xl font-bold ${potentialIncrease > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {potentialIncrease > 0 ? '+' : ''}${Math.round(potentialIncrease).toLocaleString()}
                  </div>
                  <div className={`text-sm ${potentialIncrease > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    ({potentialIncrease > 0 ? '+' : ''}{Math.round(percentageIncrease)}% change)
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 text-center">
                  Move the slider to see potential value changes
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Interactive Grade Slider */}
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Adjust Your Operational Grade
          </CardTitle>
          <CardDescription>
            Select different operational grades to see how business improvements impact your valuation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="px-2 sm:px-4">
            <p className="text-center text-slate-600 mb-6 text-sm">
              Click on any grade below to see how operational improvements impact your valuation
            </p>
            
            {/* Combined Interactive Grade Distribution */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-4 text-center text-base">Business Value Distribution by Operational Grade</h4>
              
              {/* Interactive Grade Bar */}
              <div className="relative h-16 rounded-lg overflow-hidden border border-gray-200 mb-4">
                {[
                  { grade: 'F' as OperationalGrade, color: 'bg-red-500', multiple: '2.0x', label: 'Poor Operations' },
                  { grade: 'D' as OperationalGrade, color: 'bg-red-400', multiple: '3.0x', label: 'Below Average' },
                  { grade: 'C' as OperationalGrade, color: 'bg-slate-500', multiple: '4.2x', label: 'Average Operations' },
                  { grade: 'B' as OperationalGrade, color: 'bg-blue-500', multiple: '5.7x', label: 'Good Operations' },
                  { grade: 'A' as OperationalGrade, color: 'bg-green-500', multiple: '7.5x', label: 'Excellent Operations' }
                ].map((segment, index) => (
                  <button
                    key={segment.grade}
                    onClick={() => setSliderGrade(segment.grade)}
                    className={`
                      absolute top-0 h-16 ${segment.color} cursor-pointer transition-all duration-200 
                      hover:brightness-110 hover:scale-y-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300
                      ${sliderGrade === segment.grade ? 'ring-4 ring-blue-400 scale-y-105 brightness-110' : ''}
                    `}
                    style={{
                      left: `${(index / 5) * 100}%`,
                      width: '20%'
                    }}
                    title={`Grade ${segment.grade}: ${segment.multiple} EBITDA Multiple - ${segment.label}`}
                  >
                    {/* Grade Label */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{segment.grade}</span>
                    </div>
                  </button>
                ))}
                
                {/* Current Grade Indicator - Your Actual Grade */}
                <div 
                  className="absolute -top-10 h-16 flex items-center justify-center transition-all duration-300 z-20 pointer-events-none"
                  style={{ 
                    left: `${(gradeToNumber(baseGrade) / 4) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-lg border-2 border-emerald-400 relative">
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-wide opacity-90">YOUR GRADE</div>
                        <div className="text-sm font-black">{baseGrade}</div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border border-white"></div>
                    </div>
                    <div className="w-0 h-0 border-l-6 border-r-6 border-t-10 border-transparent border-t-emerald-600 mt-1"></div>
                  </div>
                </div>
                
                {/* Selected Grade Indicator - Interactive Selection */}
                {sliderGrade !== baseGrade && (
                  <div 
                    className="absolute -top-10 h-16 flex items-center justify-center transition-all duration-300 z-20 pointer-events-none"
                    style={{ 
                      left: `${(gradeToNumber(sliderGrade) / 4) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-lg border-2 border-blue-400 relative animate-pulse">
                        <div className="text-center">
                          <div className="text-[10px] uppercase tracking-wide opacity-90">EXPLORING</div>
                          <div className="text-sm font-black">{sliderGrade}</div>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border border-white animate-ping"></div>
                      </div>
                      <div className="w-0 h-0 border-l-6 border-r-6 border-t-10 border-transparent border-t-blue-600 mt-1"></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Grade Labels and Multipliers */}
              <div className="flex justify-between text-xs text-gray-600 mb-4">
                <div className="text-center">
                  <div className="font-semibold">F</div>
                  <div className="text-red-600 font-medium">2.0x</div>
                  <div className="text-xs">Poor</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">D</div>
                  <div className="text-red-500 font-medium">3.0x</div>
                  <div className="text-xs">Below Avg</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">C</div>
                  <div className="text-slate-600 font-medium">4.2x</div>
                  <div className="text-xs">Average</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">B</div>
                  <div className="text-blue-600 font-medium">5.7x</div>
                  <div className="text-xs">Good</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">A</div>
                  <div className="text-green-600 font-medium">7.5x</div>
                  <div className="text-xs">Excellent</div>
                </div>
              </div>

              {/* Legend for Markers */}
              <div className="bg-slate-100 rounded-lg p-3 mb-4">
                <div className="text-center text-xs font-semibold text-slate-700 mb-2">Marker Legend</div>
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded border border-emerald-400 relative">
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white"></div>
                    </div>
                    <span className="text-xs font-medium text-slate-700">Your Current Grade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded border border-blue-400 relative">
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-400 rounded-full border border-white"></div>
                    </div>
                    <span className="text-xs font-medium text-slate-700">Exploring This Grade</span>
                  </div>
                </div>
              </div>

              {/* Selected Grade Info */}
              <div className="text-center bg-white rounded-lg p-4 shadow-sm border">
                <div className="text-xl font-bold text-slate-900 transition-all duration-300">
                  Selected Grade: {sliderGrade}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Your Current Grade: {baseGrade}
                </div>
                {sliderGrade !== baseGrade && (
                  <div className="mt-2 text-sm font-medium">
                    <span className={gradeToNumber(sliderGrade) > gradeToNumber(baseGrade) ? 'text-green-600' : 'text-red-600'}>
                      {gradeToNumber(sliderGrade) > gradeToNumber(baseGrade) ? '↑ Improvement Scenario' : '↓ Decline Scenario'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      {showBooking && (
        <Card className="border-2 border-blue-200 bg-blue-50 animate-in slide-in-from-bottom duration-300">
          <CardContent className="text-center p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-2">
              Ready to Unlock Your Business Value?
            </h3>
            <p className="text-blue-700 mb-4">
              By improving your operational grade from {baseGrade} to {sliderGrade}, 
              you could add <strong>${Math.round(potentialIncrease).toLocaleString()}</strong> to your business value.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Schedule Strategy Call
              </Button>
              <Button variant="outline">
                Learn About Value Drivers
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Content */}
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle>How to Improve Your Operational Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Financial Performance (Grade A: 7.5x+ multiple)</h4>
              <p className="text-gray-600">Consistent profitability, strong cash flow management, and professional financial reporting</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Operational Excellence (Grade B: 5.7x multiple)</h4>
              <p className="text-gray-600">Streamlined processes, quality management systems, and scalable operations</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Market Position (Grade C: 4.2x multiple)</h4>
              <p className="text-gray-600">Competitive differentiation, customer loyalty, and market share protection</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Risk Management (Grades D-F: 2.0-3.0x multiple)</h4>
              <p className="text-gray-600">Diversified revenue streams, reduced owner dependency, and operational stability</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}