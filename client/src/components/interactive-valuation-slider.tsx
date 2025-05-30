import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight, Phone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ValuationAssessment } from "@shared/schema";

export default function InteractiveValuationSlider() {
  // Fetch the most recent assessment data
  const { data: assessments, isLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments']
  });

  // Use most recent assessment data or defaults
  const latestAssessment = assessments?.[assessments.length - 1];
  const currentEbitda = latestAssessment ? parseFloat(latestAssessment.adjustedEbitda || "0") : 391566;
  const baseScore = latestAssessment ? 
    (latestAssessment.overallScore?.includes('A') ? 85 : 
     latestAssessment.overallScore?.includes('B') ? 75 : 
     latestAssessment.overallScore?.includes('C') ? 65 : 
     latestAssessment.overallScore?.includes('D') ? 55 : 45) : 65;

  const [sliderScore, setSliderScore] = useState(baseScore);
  const [showBooking, setShowBooking] = useState(false);

  // Update slider when new data loads
  useEffect(() => {
    setSliderScore(baseScore);
  }, [baseScore]);

  // Enhanced valuation calculation with smooth interpolation from 2.0x to 9.0x
  const calculateValuation = (score: number): number => {
    let multiple: number;
    
    if (score <= 30) {
      multiple = 0; // Not sellable
    } else if (score <= 35) {
      multiple = 0.5; // Liquidation range
    } else if (score < 90) {
      // Linear interpolation from 2.0x at score 40 to 9.0x at score 90
      const minScore = 40;
      const maxScore = 90;
      const minMultiple = 2.0;
      const maxMultiple = 9.0;
      
      const normalizedScore = Math.max(0, Math.min(1, (score - minScore) / (maxScore - minScore)));
      multiple = minMultiple + (normalizedScore * (maxMultiple - minMultiple));
    } else {
      multiple = 9.0; // Strategic range cap
    }
    
    return currentEbitda * multiple;
  };

  const currentValuation = calculateValuation(baseScore);
  const sliderValuation = calculateValuation(sliderScore);
  const potentialIncrease = sliderValuation - currentValuation;
  const percentageIncrease = currentValuation > 0 ? ((potentialIncrease / currentValuation) * 100) : 0;

  // Calculate current and slider multiples for display
  const getCurrentMultiple = (score: number): number => {
    if (score <= 30) return 0;
    if (score <= 35) return 0.5;
    if (score < 90) {
      const normalizedScore = Math.max(0, Math.min(1, (score - 40) / (90 - 40)));
      return 2.0 + (normalizedScore * (9.0 - 2.0));
    }
    return 9.0;
  };

  const currentMultiple = getCurrentMultiple(baseScore);
  const sliderMultiple = getCurrentMultiple(sliderScore);

  // Data for the comparison chart
  const chartData = [
    {
      category: 'Current',
      valuation: Math.round(currentValuation),
      multiple: currentMultiple.toFixed(1),
      score: baseScore
    },
    {
      category: 'Potential',
      valuation: Math.round(sliderValuation),
      multiple: sliderMultiple.toFixed(1),
      score: sliderScore
    }
  ];

  const getScoreCategory = (score: number): { label: string; color: string } => {
    if (score <= 30) return { label: "Not Sellable", color: "bg-red-500" };
    if (score <= 45) return { label: "Liquidation Range", color: "bg-orange-500" };
    if (score <= 60) return { label: "Below Market", color: "bg-yellow-500" };
    if (score <= 70) return { label: "Market Average", color: "bg-blue-500" };
    if (score <= 80) return { label: "Above Market", color: "bg-green-500" };
    return { label: "Strategic Range", color: "bg-purple-500" };
  };

  const currentCategory = getScoreCategory(baseScore);
  const sliderCategory = getScoreCategory(sliderScore);

  useEffect(() => {
    if (sliderScore > baseScore + 5) {
      const timer = setTimeout(() => setShowBooking(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowBooking(false);
    }
  }, [sliderScore, baseScore]);

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
          See how operational improvements translate to increased business valuation
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
            <CardDescription>Based on your Value Builder Score of {baseScore}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2 transition-all duration-300">
              ${Math.round(currentValuation).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 mb-2">
              {currentMultiple.toFixed(1)}x EBITDA Multiple
            </div>
            <Badge variant="secondary" className={`${currentCategory.color} text-white`}>
              {currentCategory.label}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-green-800">Potential Value</CardTitle>
            <CardDescription>With a Value Builder Score of {sliderScore}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-800 mb-2 transition-all duration-300">
              ${Math.round(sliderValuation).toLocaleString()}
            </div>
            <div className="text-sm text-green-700 mb-2">
              {sliderMultiple.toFixed(1)}x EBITDA Multiple
            </div>
            <Badge variant="secondary" className={`${sliderCategory.color} text-white`}>
              {sliderCategory.label}
            </Badge>
            {potentialIncrease > 0 && (
              <div className="mt-3 p-3 bg-white rounded-lg border transition-all duration-300">
                <div className="text-sm text-gray-600">Potential Increase</div>
                <div className="text-xl font-bold text-green-600">
                  +${Math.round(potentialIncrease).toLocaleString()}
                </div>
                <div className="text-sm text-green-600">
                  ({percentageIncrease.toFixed(0)}% increase)
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
          <CardDescription>Current vs potential business value</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip 
                formatter={(value: number, name) => [
                  `$${Math.round(value).toLocaleString()}`,
                  'Valuation'
                ]}
                labelFormatter={(label) => `${label} Valuation`}
              />
              <Bar 
                dataKey="valuation" 
                fill={(entry, index) => index === 0 ? "#64748B" : "#10B981"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Interactive Slider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Adjust Your Value Builder Score
          </CardTitle>
          <CardDescription>
            Move the slider to see how operational improvements impact your business value
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="px-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Not Sellable (30)</span>
              <span>Market Average (60)</span>
              <span>Strategic Range (90+)</span>
            </div>
            <Slider
              value={[sliderScore]}
              onValueChange={(value) => setSliderScore(value[0])}
              max={95}
              min={30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-center mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 transition-all duration-300">
                  Score: {sliderScore}
                </div>
                <div className="text-sm text-slate-600">
                  Current: {baseScore}
                </div>
              </div>
            </div>
          </div>

          {/* Value Distribution Visualization */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-center">Distribution of Business Value</h4>
            <div className="relative h-16 bg-gradient-to-r from-red-200 via-yellow-200 via-blue-200 via-green-200 to-purple-200 rounded-lg">
              {/* Current Score Marker */}
              <div 
                className="absolute top-0 transform -translate-x-1/2 transition-all duration-300"
                style={{ left: `${((baseScore - 30) / 65) * 100}%` }}
              >
                <div className="w-1 h-16 bg-gray-800"></div>
                <div className="text-xs text-gray-800 mt-1 whitespace-nowrap">
                  Current
                </div>
              </div>
              
              {/* Slider Score Marker */}
              <div 
                className="absolute top-0 transform -translate-x-1/2 transition-all duration-300"
                style={{ left: `${((sliderScore - 30) / 65) * 100}%` }}
              >
                <div className="w-1 h-16 bg-green-600"></div>
                <div className="text-xs text-green-600 mt-1 whitespace-nowrap">
                  Target
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>30</span>
              <span>45</span>
              <span>60</span>
              <span>75</span>
              <span>90+</span>
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
              Based on your potential {percentageIncrease.toFixed(0)}% value increase, 
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
          <CardTitle>How to Improve Your Value Builder Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Financial Performance</h4>
              <p className="text-gray-600">Improve revenue consistency and profitability tracking</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Growth Potential</h4>
              <p className="text-gray-600">Develop scalable systems and market expansion plans</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Switzerland Structure</h4>
              <p className="text-gray-600">Reduce dependency on key employees, customers, or suppliers</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recurring Revenue</h4>
              <p className="text-gray-600">Build predictable, subscription-based income streams</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}