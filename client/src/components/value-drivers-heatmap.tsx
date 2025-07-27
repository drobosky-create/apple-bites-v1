import { useState } from 'react';


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
      'C': 'bg-slate-500 hover:bg-slate-600',
      'D': 'bg-orange-500 hover:bg-orange-600',
      'F': 'bg-red-500 hover:bg-red-600'
    };
    return colorMap[grade];
  };

  const getGradeBorderColor = (grade: Grade): string => {
    const borderMap: Record<Grade, string> = {
      'A': 'border-green-600',
      'B': 'border-blue-600',
      'C': 'border-slate-600', 
      'D': 'border-orange-600',
      'F': 'border-red-600'
    };
    return borderMap[grade];
  };

  const getTrendIcon = (grade: Grade) => {
    const score = getGradeScore(grade);
    if (score >= 4) return <TrendingUp  />;
    if (score <= 2) return <TrendingDown  />;
    return <Minus  />;
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
      'medium': { color: 'bg-blue-100 text-blue-800', label: 'Medium Impact' },
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
    <div >
      <div >
        <h3 >Business Value Drivers Analysis</h3>
        <p >Interactive visualization of your business performance across key value drivers</p>
      </div>

      <div >
        {Object.entries(groupedDrivers).map(([category, categoryDrivers]) => (
          <Card key={category} className={`p-4 ${getCategoryColor(category)}`}>
            <h4 >
              {categoryLabels[category]}
            </h4>
            <div >
              {categoryDrivers.map((driver) => (
                <div key={driver.key} >
                  <button
                    onClick={() => setSelectedDriver(selectedDriver?.key === driver.key ? null : driver)}
                    className={`
                      w-full p-3 rounded-lg text-white font-medium text-sm transition-all duration-200 
                      ${getGradeColor(driver.grade)} 
                      ${selectedDriver?.key === driver.key ? `ring-2 ring-offset-2 ${getGradeBorderColor(driver.grade).replace('border-', 'ring-')}` : ''}
                      hover:scale-[1.02] cursor-pointer
                    `}
                  >
                    <div >
                      <span >{driver.label}</span>
                      <div >
                        <span >{driver.grade}</span>
                        {getTrendIcon(driver.grade)}
                      </div>
                    </div>
                  </button>
                  
                  {selectedDriver?.key === driver.key && (
                    <div >
                      <div >
                        <div>
                          <h5 >
                            {selectedDriver.label}
                          </h5>
                          <div >
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getGradeColor(selectedDriver.grade)}`}>
                              Grade {selectedDriver.grade}
                            </span>
                            {getImpactBadge(selectedDriver.impact)}
                          </div>
                        </div>
                      </div>
                      
                      <p >
                        {selectedDriver.description}
                      </p>

                      <div >
                        <div >
                          <h6 >Performance Level</h6>
                          <div >
                            <div >
                              <div 
                                className={`h-2 rounded-full ${getGradeColor(selectedDriver.grade).split(' ')[0]}`}
                                style={{ width: `${(getGradeScore(selectedDriver.grade) / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span >
                              {getGradeScore(selectedDriver.grade)}/5
                            </span>
                          </div>
                        </div>

                        <div >
                          <h6 >Impact on Valuation</h6>
                          <p >
                            <strong>{selectedDriver.impact}</strong> impact on overall business valuation
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div >
        <h4 >Grade Legend</h4>
        <div >
          {(['A', 'B', 'C', 'D', 'F'] as Grade[]).map((grade) => (
            <div key={grade} >
              <div className={`w-4 h-4 rounded ${getGradeColor(grade)}`}></div>
              <span >
                {grade} - {grade === 'A' ? 'Excellent' : grade === 'B' ? 'Good' : grade === 'C' ? 'Average' : grade === 'D' ? 'Needs Improvement' : 'At Risk'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}