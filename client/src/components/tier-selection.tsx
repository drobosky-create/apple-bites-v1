import { useState } from 'react';






import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Star, Download, TrendingUp, FileText, Zap } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { ValuationAssessment } from '@shared/schema';

interface TierSelectionProps {
  assessment: ValuationAssessment;
  onTierSelect: (tier: 'free' | 'paid') => void;
}

export default function TierSelection({ assessment, onTierSelect }: TierSelectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'free' | 'paid' | null>(null);
  const [paidTierData, setPaidTierData] = useState({
    naicsCode: '',
    sicCode: '',
    industryDescription: '',
    foundingYear: new Date().getFullYear()
  });
  const { toast } = useToast();

  const handleFreeTierDownload = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/report/generate-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId: assessment.id })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${assessment.company}_Starter_Valuation_Report.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Download Started",
          description: "Your starter report is downloading now.",
        });
        onTierSelect('free');
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate your starter report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePaidTierGenerate = async () => {
    if (!paidTierData.naicsCode || !paidTierData.industryDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide NAICS code and industry description for the strategic report.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', '/api/report/generate-enhanced', {
        assessmentId: assessment.id,
        ...paidTierData
      });
      const result = await response.json() as { success: boolean; downloadUrl?: string; message?: string };

      if (result.success && result.downloadUrl) {
        toast({
          title: "Strategic Report Generated",
          description: "Your comprehensive strategic report is ready for download.",
        });
        
        // Download the PDF
        window.open(result.downloadUrl, '_blank');
        onTierSelect('paid');
      } else {
        throw new Error(result.message || 'Failed to generate strategic report');
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate your strategic report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1a2332] mb-4">Choose Your Report Type</h1>
        <p className="text-[#1a2332]/70 max-w-2xl mx-auto">
          Get instant insights with our starter report, or unlock comprehensive strategic analysis 
          with industry-specific multipliers and AI-powered recommendations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Free Tier */}
        <Card className="p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
          <div className="text-center mb-6">
            <Badge variant="secondary" className="mb-4">STARTER REPORT</Badge>
            <h2 className="text-2xl font-bold text-[#1a2332] mb-2">Free Assessment</h2>
            <div className="text-3xl font-bold text-[#1a2332] mb-4">$0</div>
            <p className="text-gray-600">Quick valuation overview with basic insights</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>General business valuation (3x-8x multiplier)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>A-F grades for key value drivers</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Interactive grade slider visualization</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Downloadable PDF report</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Current valuation: {formatCurrency(assessment.midEstimate)}</span>
            </div>
          </div>

          <Button 
            onClick={handleFreeTierDownload}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Download Starter Report'}
          </Button>
        </Card>

        {/* Paid Tier */}
        <Card className="p-6 border-2 border-[#415A77] hover:border-[#1B263B] transition-colors relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-[#415A77] text-white font-bold px-4 py-1">
              <Star className="w-4 h-4 mr-1" />
              MOST POPULAR
            </Badge>
          </div>
          
          <div className="text-center mb-6 mt-4">
            <Badge variant="outline" className="mb-4 border-[#415A77] text-[#415A77]">STRATEGIC REPORT</Badge>
            <h2 className="text-2xl font-bold text-[#1a2332] mb-2">Professional Analysis</h2>
            <div className="text-3xl font-bold text-[#1a2332] mb-1">$395</div>
            <p className="text-sm text-gray-500 mb-4">One-time payment</p>
            <p className="text-gray-600">Comprehensive industry-specific valuation analysis</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Everything in Starter Report, plus:</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#415A77]" />
              <span>NAICS/SIC industry-specific multipliers</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-[#415A77]" />
              <span>AI-powered strategic narrative & insights</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#415A77]" />
              <span>Professional presentation-ready PDF</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#415A77]" />
              <span>Industry valuation bell curve analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Score-weighted precise multiplier calculation</span>
            </div>
          </div>

          {selectedTier === 'paid' ? (
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="naicsCode">NAICS Code *</Label>
                <Input
                  id="naicsCode"
                  placeholder="e.g., 541, 5413, 518210"
                  value={paidTierData.naicsCode}
                  onChange={(e) => setPaidTierData(prev => ({ ...prev, naicsCode: e.target.value }))}
                />
                <p className="text-sm text-gray-500 mt-1">6-digit NAICS industry classification code</p>
              </div>
              
              <div>
                <Label htmlFor="sicCode">SIC Code (Optional)</Label>
                <Input
                  id="sicCode"
                  placeholder="e.g., 8748, 7372"
                  value={paidTierData.sicCode}
                  onChange={(e) => setPaidTierData(prev => ({ ...prev, sicCode: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="industryDescription">Industry Description *</Label>
                <Textarea
                  id="industryDescription"
                  placeholder="e.g., Professional Consulting Services, Software Development, Healthcare Services"
                  value={paidTierData.industryDescription}
                  onChange={(e) => setPaidTierData(prev => ({ ...prev, industryDescription: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="foundingYear">Company Founded</Label>
                <Input
                  id="foundingYear"
                  type="number"
                  placeholder="2010"
                  value={paidTierData.foundingYear}
                  onChange={(e) => setPaidTierData(prev => ({ ...prev, foundingYear: parseInt(e.target.value) || new Date().getFullYear() }))}
                />
              </div>
            </div>
          ) : null}

          {selectedTier === 'paid' ? (
            <Button 
              onClick={handlePaidTierGenerate}
              disabled={isGenerating || !paidTierData.naicsCode || !paidTierData.industryDescription}
              className="w-full bg-[#415A77] hover:bg-[#1B263B] text-white font-bold"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating Strategic Report...' : 'Generate Strategic Report'}
            </Button>
          ) : (
            <Button 
              onClick={() => setSelectedTier('paid')}
              className="w-full bg-[#415A77] hover:bg-[#1B263B] text-white font-bold"
            >
              Upgrade to Strategic Report
            </Button>
          )}
        </Card>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>
          All reports include comprehensive value driver analysis and professional insights. 
          Strategic reports provide industry-specific accuracy and AI-powered recommendations 
          for immediate value improvement opportunities.
        </p>
      </div>
    </div>
  );
}