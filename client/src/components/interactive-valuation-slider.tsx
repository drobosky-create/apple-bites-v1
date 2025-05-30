import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight, Phone } from "lucide-react";

interface ValuationSliderProps {
  currentScore?: number;
  currentEbitda?: number;
  companyName?: string;
}

export default function InteractiveValuationSlider({ 
  currentScore = 65, 
  currentEbitda = 391566,
  companyName = "Your Business"
}: ValuationSliderProps) {
  const [sliderScore, setSliderScore] = useState(currentScore);
  const [showBooking, setShowBooking] = useState(false);

  // Calculate valuation based on score using similar logic to ValueBuilder methodology
  const calculateValuation = (score: number): number => {
    // Base multiple starts at 3.1x for score of 60-65
    let multiple = 3.1;
    
    if (score <= 30) {
      multiple = 0; // Not sellable/liquidation range
    } else if (score <= 45) {
      multiple = 0.45;
    } else if (score <= 60) {
      multiple = 2.5;
    } else if (score <= 70) {
      multiple = 4.8;
    } else if (score <= 80) {
      multiple = 6.65;
    } else if (score <= 90) {
      multiple = 10.2;
    } else {
      multiple = 13.75; // Strategic range
    }
    
    return currentEbitda * multiple;
  };

  const currentValuation = calculateValuation(currentScore);
  const sliderValuation = calculateValuation(sliderScore);
  const potentialIncrease = sliderValuation - currentValuation;
  const percentageIncrease = currentValuation > 0 ? ((potentialIncrease / currentValuation) * 100) : 0;

  const getScoreCategory = (score: number): { label: string; color: string } => {
    if (score <= 30) return { label: "Not Sellable", color: "bg-red-500" };
    if (score <= 45) return { label: "Liquidation Range", color: "bg-orange-500" };
    if (score <= 60) return { label: "Below Market", color: "bg-yellow-500" };
    if (score <= 70) return { label: "Market Average", color: "bg-blue-500" };
    if (score <= 80) return { label: "Above Market", color: "bg-green-500" };
    return { label: "Strategic Range", color: "bg-purple-500" };
  };

  const currentCategory = getScoreCategory(currentScore);
  const sliderCategory = getScoreCategory(sliderScore);

  useEffect(() => {
    if (sliderScore > currentScore + 5) {
      const timer = setTimeout(() => setShowBooking(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowBooking(false);
    }
  }, [sliderScore, currentScore]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Value Improvement Calculator
        </h2>
        <p className="text-slate-600">
          See how improving your business operations increases your valuation
        </p>
      </div>

      {/* Current vs Potential Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Current Value</CardTitle>
            <CardDescription>Based on your Value Builder Score of {currentScore}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              ${Math.round(currentValuation).toLocaleString()}
            </div>
            <Badge variant="secondary" className={`${currentCategory.color} text-white`}>
              {currentCategory.label}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-green-800">Potential Value</CardTitle>
            <CardDescription>With a Value Builder Score of {sliderScore}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-800 mb-2">
              ${Math.round(sliderValuation).toLocaleString()}
            </div>
            <Badge variant="secondary" className={`${sliderCategory.color} text-white`}>
              {sliderCategory.label}
            </Badge>
            {potentialIncrease > 0 && (
              <div className="mt-3 p-2 bg-white rounded-lg">
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
              step={5}
              className="w-full"
            />
            <div className="flex justify-center mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  Score: {sliderScore}
                </div>
                <div className="text-sm text-slate-600">
                  Current: {currentScore}
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
                className="absolute top-0 transform -translate-x-1/2"
                style={{ left: `${((currentScore - 30) / 65) * 100}%` }}
              >
                <div className="w-1 h-16 bg-gray-800"></div>
                <div className="text-xs text-gray-800 mt-1 whitespace-nowrap">
                  Current
                </div>
              </div>
              
              {/* Slider Score Marker */}
              <div 
                className="absolute top-0 transform -translate-x-1/2"
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
        <Card className="border-2 border-blue-200 bg-blue-50">
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