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
    switch (grade) {
      case 'A': return 7.5; // 6.5x to 9.0x range
      case 'B': return 5.7; // 5.0x to 6.4x range
      case 'C': return 4.2; // 3.5x to 4.9x range
      case 'D': return 3.0; // 2.5x to 3.4x range
      case 'F': return 2.0; // < 2.5x range
    }
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
      case 'C': return { label: "Average Operations", color: "text-yellow-700", bgColor: "bg-yellow-500" };
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
            Based on data from {latestAssessment.company || 'your recent assessment'}
          </p>
        )}
      </div>

      {/* Current vs Potential Value Cards with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Current Value</CardTitle>
            <CardDescription>Based on your Operational Grade of {baseGrade}</CardDescription>
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

        <Card className="border-2 border-green-200 bg-green-50 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-green-800">Potential Value</CardTitle>
            <CardDescription>
              {sliderGrade === 'A' ? 'At Grade A Operations' : `With an Operational Grade of A`}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-800 mb-2 transition-all duration-300">
              ${Math.round(sliderGrade === 'A' ? sliderValuation : calculateValuation('A')).toLocaleString()}
            </div>
            <div className="text-sm text-green-700 mb-2">
              {sliderGrade === 'A' ? sliderMultiple.toFixed(1) : getMultipleForGrade('A').toFixed(1)}x EBITDA Multiple
            </div>
            <Badge variant="secondary" className={`${sliderGrade === 'A' ? sliderCategory.bgColor : 'bg-green-500'} text-white`}>
              {sliderGrade === 'A' ? sliderCategory.label : 'Excellent Operations'}
            </Badge>
            {(sliderGrade === 'A' ? potentialIncrease : calculateValuation('A') - currentValuation) > 0 && (
              <div className="mt-3 p-3 bg-white rounded-lg border transition-all duration-300">
                <div className="text-sm text-gray-600">Potential Increase</div>
                <div className="text-xl font-bold text-green-600">
                  +${Math.round(sliderGrade === 'A' ? potentialIncrease : calculateValuation('A') - currentValuation).toLocaleString()}
                </div>
                <div className="text-sm text-green-600">
                  ({Math.round(((sliderGrade === 'A' ? potentialIncrease : calculateValuation('A') - currentValuation) / currentValuation) * 100)}% increase)
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Comparison</CardTitle>
          <CardDescription>Current vs potential business value by operational grade</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip 
                formatter={(value: number) => [
                  `$${Math.round(value).toLocaleString()}`,
                  'Valuation'
                ]}
                labelFormatter={(label) => `${label} Valuation`}
              />
              <Bar 
                dataKey="valuation" 
                fill="#64748B"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Interactive Grade Slider */}
      <Card>
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
            <div className="relative h-16 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-green-400 rounded-lg">
              {/* Current Grade Marker */}
              <div 
                className="absolute top-0 transform -translate-x-1/2 transition-all duration-300"
                style={{ left: `${(gradeToNumber(baseGrade) / 4) * 100}%` }}
              >
                <div className="w-1 h-16 bg-gray-800"></div>
                <div className="text-xs text-gray-800 mt-1 whitespace-nowrap">
                  Current
                </div>
              </div>
              
              {/* Slider Grade Marker */}
              <div 
                className="absolute top-0 transform -translate-x-1/2 transition-all duration-300"
                style={{ left: `${(gradeToNumber(sliderGrade) / 4) * 100}%` }}
              >
                <div className="w-1 h-16 bg-green-600"></div>
                <div className="text-xs text-green-600 mt-1 whitespace-nowrap">
                  Target
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>F</span>
              <span>D</span>
              <span>C</span>
              <span>B</span>
              <span>A</span>
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
              <Button className="bg-blue-600 hover:bg-blue-700">
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
      <Card>
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