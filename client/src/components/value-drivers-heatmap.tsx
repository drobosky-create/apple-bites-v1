import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ValuationAssessment } from '@shared/schema';

interface ValueDriversHeatmapProps {
  assessment: ValuationAssessment;
}

type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

interface DriverData {
  key: string;
  label: string;
  grade: Grade;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'financial' | 'operational' | 'strategic' | 'risk';
}

export default function ValueDriversHeatmap({ assessment }: ValueDriversHeatmapProps) {
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);

  const getGradeScore = (grade: string): number => {
    const gradeMap: Record<string, number> = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
    return gradeMap[grade] || 3;
  };

  const getGradeColor = (grade: Grade): string => {
    const colorMap: Record<Grade, string> = {
      'A': 'bg-green-500 hover:bg-green-600',
      'B': 'bg-blue-500 hover:bg-blue-600', 
      'C': 'bg-yellow-500 hover:bg-yellow-600',
      'D': 'bg-orange-500 hover:bg-orange-600',
      'F': 'bg-red-500 hover:bg-red-600'
    };
    return colorMap[grade];
  };

  const getGradeBorderColor = (grade: Grade): string => {
    const borderMap: Record<Grade, string> = {
      'A': 'border-green-600',
      'B': 'border-blue-600',
      'C': 'border-yellow-600', 
      'D': 'border-orange-600',
      'F': 'border-red-600'
    };
    return borderMap[grade];
  };

  const getTrendIcon = (grade: Grade) => {
    const score = getGradeScore(grade);
    if (score >= 4) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (score <= 2) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-yellow-600" />;
  };

  const drivers: DriverData[] = [
    {
      key: 'financialPerformance',
      label: 'Financial Performance',
      grade: (assessment.financialPerformance || 'C') as Grade,
      description: 'Revenue growth, profitability margins, and cash flow generation',
      impact: 'high',
      category: 'financial'
    },
    {
      key: 'customerConcentration', 
      label: 'Customer Concentration',
      grade: (assessment.customerConcentration || 'C') as Grade,
      description: 'Diversification of customer base and revenue streams',
      impact: 'high',
      category: 'risk'
    },
    {
      key: 'managementTeam',
      label: 'Management Team',
      grade: (assessment.managementTeam || 'C') as Grade,
      description: 'Leadership capability, experience, and succession planning',
      impact: 'high',
      category: 'operational'
    },
    {
      key: 'competitivePosition',
      label: 'Competitive Position', 
      grade: (assessment.competitivePosition || 'C') as Grade,
      description: 'Market share, differentiation, and competitive advantages',
      impact: 'high',
      category: 'strategic'
    },
    {
      key: 'growthProspects',
      label: 'Growth Prospects',
      grade: (assessment.growthProspects || 'C') as Grade,
      description: 'Market opportunities, scalability, and expansion potential',
      impact: 'high',
      category: 'strategic'
    },
    {
      key: 'systemsProcesses',
      label: 'Systems & Processes',
      grade: (assessment.systemsProcesses || 'C') as Grade,
      description: 'Operational efficiency, technology, and process documentation',
      impact: 'medium',
      category: 'operational'
    },
    {
      key: 'assetQuality',
      label: 'Asset Quality',
      grade: (assessment.assetQuality || 'C') as Grade,
      description: 'Condition and value of physical and intangible assets',
      impact: 'medium',
      category: 'financial'
    },
    {
      key: 'industryOutlook',
      label: 'Industry Outlook',
      grade: (assessment.industryOutlook || 'C') as Grade,
      description: 'Industry growth trends, regulatory environment, and market dynamics',
      impact: 'medium',
      category: 'strategic'
    },
    {
      key: 'riskFactors',
      label: 'Risk Factors',
      grade: (assessment.riskFactors || 'C') as Grade,
      description: 'Business risks, regulatory compliance, and risk mitigation',
      impact: 'medium',
      category: 'risk'
    },
    {
      key: 'ownerDependency',
      label: 'Owner Dependency',
      grade: (assessment.ownerDependency || 'C') as Grade,
      description: 'Business reliance on owner involvement and key personnel',
      impact: 'high',
      category: 'risk'
    }
  ];

  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      'financial': 'bg-blue-50 border-blue-200',
      'operational': 'bg-green-50 border-green-200',
      'strategic': 'bg-purple-50 border-purple-200',
      'risk': 'bg-red-50 border-red-200'
    };
    return categoryColors[category] || 'bg-gray-50 border-gray-200';
  };

  const getImpactBadge = (impact: string) => {
    const impactConfig: Record<string, { color: string; label: string }> = {
      'high': { color: 'bg-red-100 text-red-800', label: 'High Impact' },
      'medium': { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Impact' },
      'low': { color: 'bg-green-100 text-green-800', label: 'Low Impact' }
    };
    const config = impactConfig[impact];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const groupedDrivers = drivers.reduce((acc, driver) => {
    if (!acc[driver.category]) acc[driver.category] = [];
    acc[driver.category].push(driver);
    return acc;
  }, {} as Record<string, DriverData[]>);

  const categoryLabels: Record<string, string> = {
    'financial': 'Financial Drivers',
    'operational': 'Operational Drivers', 
    'strategic': 'Strategic Drivers',
    'risk': 'Risk Factors'
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Business Value Drivers Analysis</h3>
        <p className="text-slate-600">Interactive visualization of your business performance across key value drivers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {Object.entries(groupedDrivers).map(([category, categoryDrivers]) => (
            <Card key={category} className={`p-4 ${getCategoryColor(category)}`}>
              <h4 className="font-semibold text-slate-900 mb-3 capitalize">
                {categoryLabels[category]}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {categoryDrivers.map((driver) => (
                  <button
                    key={driver.key}
                    onClick={() => setSelectedDriver(driver)}
                    className={`
                      p-3 rounded-lg text-white font-medium text-sm transition-all duration-200 
                      ${getGradeColor(driver.grade)} 
                      ${selectedDriver?.key === driver.key ? `ring-2 ring-offset-2 ${getGradeBorderColor(driver.grade).replace('border-', 'ring-')}` : ''}
                      hover:scale-105 cursor-pointer
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs leading-tight">{driver.label}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold">{driver.grade}</span>
                        {getTrendIcon(driver.grade)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:sticky lg:top-6">
          {selectedDriver ? (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-1">
                    {selectedDriver.label}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getGradeColor(selectedDriver.grade)}`}>
                      Grade {selectedDriver.grade}
                    </span>
                    {getImpactBadge(selectedDriver.impact)}
                  </div>
                </div>
                {getTrendIcon(selectedDriver.grade)}
              </div>
              
              <p className="text-slate-600 mb-4">
                {selectedDriver.description}
              </p>

              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-2">Performance Level</h5>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getGradeColor(selectedDriver.grade).split(' ')[0]}`}
                        style={{ width: `${(getGradeScore(selectedDriver.grade) / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      {getGradeScore(selectedDriver.grade)}/5
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-2">Impact on Valuation</h5>
                  <p className="text-sm text-slate-600 capitalize">
                    This driver has <strong>{selectedDriver.impact}</strong> impact on your overall business valuation.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-slate-900 mb-2">
                Select a Value Driver
              </h4>
              <p className="text-slate-600">
                Click on any value driver tile to view detailed analysis and performance metrics.
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-medium text-slate-900 mb-2">Grade Legend</h4>
        <div className="flex flex-wrap gap-2">
          {(['A', 'B', 'C', 'D', 'F'] as Grade[]).map((grade) => (
            <div key={grade} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${getGradeColor(grade)}`}></div>
              <span className="text-sm text-slate-600">
                {grade} - {grade === 'A' ? 'Excellent' : grade === 'B' ? 'Good' : grade === 'C' ? 'Average' : grade === 'D' ? 'Needs Improvement' : 'At Risk'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}