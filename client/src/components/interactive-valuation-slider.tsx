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
  const currentEbitda = latestAssessment ? parseFloat(latestAssessment.adjustedEbitda || "0") : 1379841;
  const baseGrade: OperationalGrade = latestAssessment ? 
    (latestAssessment.overallScore?.charAt(0) as OperationalGrade || 'C') : 'C';

  const [sliderGrade, setSliderGrade] = useState<OperationalGrade>(baseGrade);
  const [showBooking, setShowBooking] = useState(false);

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Business Value Improvement Calculator
        </h2>
        <p className="text-slate-600">
          See how improving your business operations translates to increased valuation
        </p>
        {latestAssessment && (
          <p className="text-sm text-slate-500 mt-2">
            Based on your recent assessment data
          </p>
        )}
      </div>

      {/* Current vs Potential Value Cards with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 border-slate-200 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Current Value</CardTitle>
            <CardDescription className="text-sm text-[#080000]">Based on your Operational Grade of {baseGrade}</CardDescription>
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

        <Card className="border-2 border-[#f5c842] bg-gradient-to-br from-[#f5c842]/10 to-[#1a2332]/5 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-[#1a2332]">Potential Value</CardTitle>
            <CardDescription className="text-sm text-[#1a2332]/70">
              With an Operational Grade of {sliderGrade}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-[#1a2332] mb-2 transition-all duration-300">
              ${Math.round(sliderValuation).toLocaleString()}
            </div>
            <div className="text-sm text-blue-700 mb-2">
              {sliderMultiple.toFixed(1)}x EBITDA Multiple
            </div>
            <Badge variant="secondary" className={`${sliderCategory.bgColor} text-white`}>
              {sliderCategory.label}
            </Badge>
            {potentialIncrease !== 0 && (
              <div className="mt-3 p-3 bg-white rounded-lg border transition-all duration-300">
                <div className="text-sm text-gray-600">
                  {potentialIncrease > 0 ? 'Potential Increase' : 'Potential Decrease'}
                </div>
                <div className={`text-xl font-bold ${potentialIncrease > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {potentialIncrease > 0 ? '+' : ''}${Math.round(potentialIncrease).toLocaleString()}
                </div>
                <div className={`text-sm ${potentialIncrease > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ({potentialIncrease > 0 ? '+' : ''}{Math.round(percentageIncrease)}% change)
                </div>
              </div>
            )}
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
            Move the slider to see how improving your business operations impacts your valuation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="px-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>F - Poor</span>
              <span>C - Average</span>
              <span>A - Excellent</span>
            </div>
            <Slider
              value={[gradeToNumber(sliderGrade)]}
              onValueChange={(value) => setSliderGrade(numberToGrade(value[0]))}
              max={4}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-center mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 transition-all duration-300">
                  Grade: {sliderGrade}
                </div>
                <div className="text-sm text-slate-600">
                  Current: {baseGrade}
                </div>
              </div>
            </div>
          </div>

          {/* Grade Distribution Visualization */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-center">Distribution of Business Value by Grade</h4>
            <div className="relative h-16 rounded-lg overflow-hidden border border-gray-200">
              {/* Grade Segments */}
              {[
                { grade: 'F', color: 'bg-red-500', multiple: '2.0x', label: 'Poor Operations' },
                { grade: 'D', color: 'bg-red-400', multiple: '3.0x', label: 'Below Average' },
                { grade: 'C', color: 'bg-slate-500', multiple: '4.2x', label: 'Average Operations' },
                { grade: 'B', color: 'bg-blue-400', multiple: '5.7x', label: 'Good Operations' },
                { grade: 'A', color: 'bg-blue-600', multiple: '7.5x', label: 'Excellent Operations' }
              ].map((segment, index) => (
                <div
                  key={segment.grade}
                  className={`absolute top-0 h-16 ${segment.color} group cursor-pointer transition-all duration-200 hover:brightness-110`}
                  style={{
                    left: `${(index / 5) * 100}%`,
                    width: '20%'
                  }}
                  title={`Grade ${segment.grade}: ${segment.multiple} EBITDA Multiple - ${segment.label}`}
                >
                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap shadow-lg">
                      <div className="font-semibold">Grade {segment.grade}</div>
                      <div>{segment.multiple} Multiple</div>
                      <div className="text-gray-300">{segment.label}</div>
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  
                  {/* Grade Label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{segment.grade}</span>
                  </div>
                </div>
              ))}
              
              {/* Current Grade Indicator */}
              <div 
                className="absolute top-0 h-16 flex items-center justify-center transition-all duration-300 z-20"
                style={{ 
                  left: `${(gradeToNumber(baseGrade) / 4) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-16 bg-gray-800 shadow-lg"></div>
                  <div className="text-xs text-gray-800 mt-1 bg-white px-1 rounded shadow">
                    Current
                  </div>
                </div>
              </div>
              
              {/* Target Grade Indicator */}
              {sliderGrade !== baseGrade && (
                <div 
                  className="absolute top-0 h-16 flex items-center justify-center transition-all duration-300 z-20"
                  style={{ 
                    left: `${(gradeToNumber(sliderGrade) / 4) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-16 bg-blue-600 shadow-lg"></div>
                    <div className="text-xs text-blue-600 mt-1 bg-white px-1 rounded shadow">
                      Target
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Grade Labels Below */}
            <div className="flex justify-between text-xs text-gray-600 mt-3 px-2">
              <div className="text-center">
                <div className="font-semibold">F</div>
                <div className="text-red-600">2.0x</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">D</div>
                <div className="text-red-500">3.0x</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">C</div>
                <div className="text-slate-600">4.2x</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">B</div>
                <div className="text-blue-600">5.7x</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">A</div>
                <div className="text-blue-700">7.5x</div>
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
                onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/scheduleanappointmentcallwithus-230ad544-8f6f-4125-9d14-f1b202f0becc-7fdb3832-39a9-4c80-a146-60233fb444a1-aaa07f1f-456b-4ccc-81e4-adb0ad437aa3-0b2d0529-cb48-461f-b8b5-712b398e91eb-fcbf65a8-70d2-4009-b786-ac4166822f0b-0f63997e-5577-46ae-9f21-00d7deb09698-236c7ec4-83c2-48f3-8aac-f523237ed3b4', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')}
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