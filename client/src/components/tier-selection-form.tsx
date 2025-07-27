


import { CheckCircle, Star, ArrowLeft } from 'lucide-react';
import type { ValuationFormData } from '@/hooks/use-valuation-form';

interface TierSelectionFormProps {
  formData: ValuationFormData;
  onFreeReport: () => void;
  onPaidReport: () => void;
  onPrev: () => void;
}

export default function TierSelectionForm({ 
  formData, 
  onFreeReport, 
  onPaidReport, 
  onPrev 
}: TierSelectionFormProps) {
  
  const formatCurrency = (value: string | null) => {
    if (!value) return '$0';
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1a2332] mb-2">Choose Your Report Type</h2>
        <p className="text-slate-600">
          Select the type of valuation report that best fits your needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Free Tier */}
        <Card className="border-2 border-slate-200 hover:border-blue-300 transition-colors">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600">BASIC REPORT</Badge>
              <h3 className="text-xl font-bold text-[#1a2332] mb-2">Standard Analysis</h3>
              <div className="text-3xl font-bold text-[#1a2332] mb-1">Free</div>
              <p className="text-slate-600 mb-4">Quick business valuation overview</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span>General 3x-8x EBITDA multipliers</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span>A-F grade assessment across 10 value drivers</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span>Basic PDF report with valuation range</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span>Email delivery</span>
              </div>
            </div>
            
            <Button 
              onClick={onFreeReport}
              className="w-full bg-[#1a2332] text-white hover:bg-[#2a3442]"
            >
              Get Free Report
            </Button>
          </CardContent>
        </Card>

        {/* Paid Tier */}
        <Card className="border-2 border-[#415A77] hover:border-[#1B263B] transition-colors relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-[#415A77] text-white hover:bg-[#1B263B]">
              <Star className="w-3 h-3 mr-1" />
              RECOMMENDED
            </Badge>
          </div>
          
          <CardContent className="p-6">
            <div className="text-center mb-6 mt-4">
              <Badge variant="outline" className="mb-4 border-[#415A77] text-[#415A77]">STRATEGIC REPORT</Badge>
              <h3 className="text-xl font-bold text-[#1a2332] mb-2">Professional Analysis</h3>
              <div className="text-3xl font-bold text-[#1a2332] mb-1">$395</div>
              <p className="text-sm text-gray-500 mb-4">One-time payment</p>
              <p className="text-slate-600">Comprehensive industry-specific analysis</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="font-medium">Industry-specific NAICS multipliers</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="font-medium">AI-powered strategic insights</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="font-medium">Market positioning analysis</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="font-medium">Professional presentation-ready PDF</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="font-medium">Executive summary & recommendations</span>
              </div>
            </div>
            
            <Button 
              onClick={onPaidReport}
              className="w-full bg-[#415A77] text-white hover:bg-[#1B263B] font-semibold"
            >
              Get Strategic Report - $395
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="text-sm text-slate-500">
          All reports include secure email delivery and can be downloaded immediately
        </div>
      </div>
    </div>
  );
}