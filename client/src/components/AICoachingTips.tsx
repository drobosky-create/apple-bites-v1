import React, { useState, useEffect } from 'react';



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
      case 'Revenue Growth': return <TrendingUp  />;
      case 'Cost Management': return <DollarSign  />;
      case 'Strategic Planning': return <Target  />;
      default: return <Lightbulb  />;
    }
  };

  return (
    <div >
      {/* Header */}
      <Card >
        <CardHeader>
          <CardTitle >
            <Brain  />
            AI-Powered Financial Coaching
          </CardTitle>
          <p >
            Get personalized recommendations to improve your business valuation based on your financial data and industry benchmarks.
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={fetchCoachingData}
            disabled={loading}
            
          >
            {loading ? (
              <>
                <Loader2  />
                Analyzing Your Business...
              </>
            ) : (
              <>
                <Brain  />
                Get AI Coaching Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card >
          <CardContent >
            <p >{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Contextual Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle >
              <Lightbulb  />
              Business Analysis Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p >{insights}</p>
          </CardContent>
        </Card>
      )}

      {/* Coaching Tips */}
      {tips.length > 0 && (
        <div >
          <h3 >Personalized Recommendations</h3>
          <div >
            {tips.map((tip, index) => (
              <Card key={index} >
                <CardHeader >
                  <div >
                    <div >
                      {getCategoryIcon(tip.category)}
                      <CardTitle >{tip.title}</CardTitle>
                    </div>
                    <Badge className={getPriorityColor(tip.priority)}>
                      {tip.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p >{tip.category}</p>
                </CardHeader>
                <CardContent >
                  <p  style={{ textDecoration: 'none' }}>{tip.description}</p>
                  
                  <div>
                    <h4 >Action Items:</h4>
                    <ul >
                      {tip.actionItems.map((action, actionIndex) => (
                        <li key={actionIndex} >
                          <span ></span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div >
                    <div>
                      <div >
                        <Target  />
                        Potential Impact
                      </div>
                      <p >{tip.potentialImpact}</p>
                    </div>
                    <div>
                      <div >
                        <Clock  />
                        Timeline
                      </div>
                      <p >{tip.timeline}</p>
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