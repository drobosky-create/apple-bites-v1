import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, DollarSign, Clock, Target, Loader2, Brain } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CoachingTip {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  potentialImpact: string;
  timeline: string;
}

interface AICoachingTipsProps {
  financialData: {
    revenue: number;
    ebitda: number;
    adjustedEbitda: number;
    naicsCode: string;
    industryTitle: string;
    valueDriverScores: Record<string, number>;
    userMultiple: number;
    industryAverage: number;
    companySize: 'small' | 'medium' | 'large';
    businessAge?: string;
    employeeCount?: number;
  };
}

const AICoachingTips: React.FC<AICoachingTipsProps> = ({ financialData }) => {
  const [tips, setTips] = useState<CoachingTip[]>([]);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoachingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both coaching tips and insights simultaneously
      const [tipsResponse, insightsResponse] = await Promise.all([
        apiRequest('POST', '/api/ai-coaching/tips', financialData),
        apiRequest('POST', '/api/ai-coaching/insights', financialData)
      ]);

      const tipsData = await tipsResponse.json();
      const insightsData = await insightsResponse.json();
      
      setTips(tipsData.tips || []);
      setInsights(insightsData.insights || '');
    } catch (err) {
      setError('Failed to generate AI coaching recommendations. Please try again.');
      console.error('Error fetching coaching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Revenue Growth': return <TrendingUp className="w-4 h-4" />;
      case 'Cost Management': return <DollarSign className="w-4 h-4" />;
      case 'Strategic Planning': return <Target className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Brain className="w-5 h-5" />
            AI-Powered Financial Coaching
          </CardTitle>
          <p className="text-sm text-gray-600">
            Get personalized recommendations to improve your business valuation based on your financial data and industry benchmarks.
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={fetchCoachingData}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Your Business...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Get AI Coaching Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Contextual Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-500" />
              Business Analysis Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{insights}</p>
          </CardContent>
        </Card>
      )}

      {/* Coaching Tips */}
      {tips.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Personalized Recommendations</h3>
          <div className="grid gap-4">
            {tips.map((tip, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(tip.category)}
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </div>
                    <Badge className={getPriorityColor(tip.priority)}>
                      {tip.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{tip.category}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 no-underline" style={{ textDecoration: 'none' }}>{tip.description}</p>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Action Items:</h4>
                    <ul className="space-y-1">
                      {tip.actionItems.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Target className="w-3 h-3" />
                        Potential Impact
                      </div>
                      <p className="text-sm font-medium text-green-700">{tip.potentialImpact}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Clock className="w-3 h-3" />
                        Timeline
                      </div>
                      <p className="text-sm font-medium text-blue-700">{tip.timeline}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoachingTips;