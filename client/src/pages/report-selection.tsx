import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import PricingPanel from '@/components/PricingPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { ValuationAssessment } from '@shared/schema';

export default function ReportSelectionPage() {
  const [match, params] = useRoute('/report-selection/:id');
  const [selectedTier, setSelectedTier] = useState<'free' | 'paid' | null>(null);
  
  const assessmentId = params?.id ? parseInt(params.id) : null;

  const { data: assessment, isLoading, error } = useQuery<ValuationAssessment>({
    queryKey: ['/api/assessment', assessmentId],
    queryFn: async () => {
      if (!assessmentId) throw new Error('No assessment ID provided');
      const response = await fetch(`/api/assessment/${assessmentId}`);
      if (!response.ok) throw new Error('Failed to fetch assessment');
      return response.json();
    },
    enabled: !!assessmentId,
  });

  if (!match || !assessmentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Assessment</h1>
          <p className="text-gray-600 mb-6">The assessment ID is missing or invalid.</p>
          <Button onClick={() => window.location.href = '/valuation-form'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Valuation Form
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Assessment Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the assessment you're looking for.</p>
          <Button onClick={() => window.location.href = '/valuation-form'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start New Assessment
          </Button>
        </Card>
      </div>
    );
  }

  const handleTierSelect = (tier: 'free' | 'paid') => {
    setSelectedTier(tier);
    // Redirect back to results page after a delay
    setTimeout(() => {
      window.location.href = `/results/${assessmentId}`;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = `/results/${assessmentId}`}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Results
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-[#1a2332]">
                {assessment.company} - Report Selection
              </h1>
              <p className="text-sm text-gray-600">
                Choose the report type that best fits your needs
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        {selectedTier ? (
          <div className="max-w-2xl mx-auto text-center p-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                {selectedTier === 'free' ? 'Starter Report' : 'Strategic Report'} Generated!
              </h2>
              <p className="text-green-700 mb-4">
                Your {selectedTier === 'free' ? 'starter' : 'strategic'} valuation report has been generated successfully.
              </p>
              <p className="text-sm text-gray-600">
                Redirecting you back to your results...
              </p>
            </div>
          </div>
        ) : (
          <PricingPanel 
            assessment={assessment} 
            onTierSelect={handleTierSelect}
          />
        )}
      </div>
    </div>
  );
}