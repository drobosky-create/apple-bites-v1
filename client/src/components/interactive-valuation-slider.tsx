import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";




import { TrendingUp, ArrowRight, Phone } from "lucide-react";
import ModernGradeChart from './modern-grade-chart';
import OperationalGradeGauge from './OperationalGradeGauge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ValuationAssessment } from "@shared/schema";

type OperationalGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export default function InteractiveValuationSlider() {
  const [location] = useLocation();
  
  // Get assessment ID from URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const assessmentId = urlParams.get('assessmentId');
  
  // Fetch the assessment data
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

  // Use specific assessment if ID provided, otherwise use most recent
  const targetAssessment = assessmentId 
    ? assessments?.find(a => a.id.toString() === assessmentId)
    : assessments?.[assessments.length - 1];
  
  // Ensure EBITDA is properly parsed from string to number
  const getEbitdaValue = (assessment: ValuationAssessment | undefined): number => {
    if (!assessment) return 1379841; // Default fallback
    
    const adjustedEbitda = assessment.adjustedEbitda;
    if (!adjustedEbitda) return 1379841;
    
    const parsed = typeof adjustedEbitda === 'string' ? parseFloat(adjustedEbitda) : adjustedEbitda;
    return !isNaN(parsed) && parsed > 0 ? parsed : 1379841;
  };
  
  const currentEbitda = getEbitdaValue(targetAssessment);
  const baseGrade: OperationalGrade = targetAssessment ? 
    (targetAssessment.overallScore?.charAt(0) as OperationalGrade || 'C') : 'C';

  const [sliderGrade, setSliderGrade] = useState<OperationalGrade>(baseGrade);
  const [showBooking, setShowBooking] = useState(false);

  // Handle slider change without auto-scrolling
  const handleSliderChange = (value: number[]) => {
    const newGrade = numberToGrade(value[0]);
    setSliderGrade(newGrade);
  };

  // Update slider when new data loads
  useEffect(() => {
    setSliderGrade(baseGrade);
  }, [baseGrade]);

  // EBITDA multiples based on operational grades
  const getMultipleForGrade = (grade: OperationalGrade): number => {
    // Using centralized multiplier scale for consistency
    const multipliers = {
      'A': 7.5, // Excellent Operations
      'B': 5.7, // Good Operations
      'C': 4.2, // Average Operations
      'D': 3.0, // Needs Improvement
      'F': 2.0  // At Risk
    };
    return multipliers[grade] || 4.2;
  };

  const calculateValuation = (grade: OperationalGrade): number => {
    const multiple = getMultipleForGrade(grade);
    return currentEbitda * multiple;
  };

  const getGradeInfo = (grade: 'A' | 'B' | 'C' | 'D' | 'F') => {
    const multiplier = getMultipleForGrade(grade);
    const colorMap = {
      'A': { bg: 'bg-green-500/85', border: 'border-green-400', gradient: 'from-green-50 to-emerald-50', borderColor: 'border-green-200/30',badgeBg: 'bg-green-500',
             badgeTextColor: 'text-white', },
      'B': { bg: 'bg-blue-500/80', border: 'border-blue-400', gradient: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-200/50',badgeBg: 'bg-blue-500',
             badgeTextColor: 'text-white', },
      'C': { bg: 'bg-yellow-500/85', border: 'border-yellow-400', gradient: 'from-yellow-50 to-orange-50', borderColor: 'border-yellow-200/30',badgeBg: 'bg-yellow-400',
             badgeTextColor: 'text-gray-900', },
      'D': { bg: 'bg-orange-500/85', border: 'border-orange-400', gradient: 'from-orange-50 to-red-50', borderColor: 'border-orange-200/30', badgeBg: 'bg-orange-500',
             badgeTextColor: 'text-white', },
      'F': { bg: 'bg-red-500/85', border: 'border-red-400', gradient: 'from-red-50 to-pink-50', borderColor: 'border-red-200/30', badgeBg: 'bg-red-500',
             badgeTextColor: 'text-white', }
    };
    return { 
      multiplier, 
      ...colorMap[grade],
      label: `Grade ${grade}: ${multiplier.toFixed(1)}x`
    };
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
      case 'C': return { label: "Average Operations", color: "text-slate-700", bgColor: "bg-slate-500" };
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
      <div >
        <div >
          <div ></div>
          <div >
            <div ></div>
            <div ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div >
      <div >
        {targetAssessment && (
          <p >
            Based on your assessment data
          </p>
        )}
      </div>
      {/* Current vs Potential Value Cards with Glassmorphism */}
      <div >
        {/* Current Value Card */}
        <div >
          
          <h3 >
            Current Value 
            <span >
              You are here
            </span>
          </h3>
          <p >Based on your Operational Grade of {baseGrade}</p>
          <div >
            ${currentValuation.toLocaleString()}
          </div>
          <div >
            {currentMultiple}x EBITDA Multiple
          </div>
          <span >
            {currentCategory.label}
          </span>
        </div>

        {/* Potential Value Card */}
        <div className={`backdrop-blur-md rounded-xl shadow-2xl border p-4 sm:p-6 value-card-hover relative overflow-hidden transition-all duration-300 ${
          sliderGrade !== baseGrade ? 
            (potentialIncrease > 0 ? 
              'bg-green-500/20 border-green-400/40 ring-2 ring-green-400 ring-opacity-50 shadow-2xl shadow-green-400/30' : 
              'bg-red-500/20 border-red-400/40 ring-2 ring-red-400 ring-opacity-50 shadow-2xl shadow-red-400/30'
            )
            : 'bg-black/60 border-white/10'
        }`}>
          
          <div >
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 tracking-wide ${
              sliderGrade !== baseGrade ? 'text-black' : 'text-white'
            }`}>Potential Value</h3>
            {sliderGrade !== baseGrade ? (
              <p className={`text-sm sm:text-base mb-3 ${
                sliderGrade !== baseGrade ? 'text-black/80' : 'text-white/80'
              }`}>
                Based on selected grade ({sliderGrade})
              </p>
            ) : (
              <p className={`text-sm sm:text-base mb-3 ${
                sliderGrade !== baseGrade ? 'text-black/80' : 'text-white/80'
              }`}>
                Based on selected grade ({sliderGrade})
              </p>
            )}
            <div className={`text-3xl sm:text-4xl font-bold mb-3 ${
              sliderGrade !== baseGrade ? 'text-black' : 'text-white'
            }`}>
              ${sliderValuation.toLocaleString()}
            </div>
            <div className={`text-sm sm:text-base font-semibold mb-3 ${
              sliderGrade !== baseGrade ? 'text-black/90' : 'text-white/90'
            }`}>
              {sliderMultiple}x EBITDA Multiple
            </div>
            <span className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-white/20 border border-white/30 ${
              sliderGrade !== baseGrade ? 'text-black' : 'text-white'
            }`}>
              {sliderCategory.label}
            </span>
          </div>
        </div>
      </div>


      {/* Combined Gauge and Grade Selection */}
      <div >
        {/* Gauge and Potential Gain Side by Side */}
        <div >
          {/* Gauge Section */}
          <div >
            <OperationalGradeGauge 
              grade={sliderGrade}
              title="Operational Grade Impact Analysis"
              animated={true}
            />
          </div>
          
          {/* Potential Gain Display */}
          <div >
            {sliderGrade !== baseGrade ? (
              <div className={`w-full rounded-xl p-4 text-center transition-all duration-300 ${
                potentialIncrease > 0 
                  ? 'bg-green-500/80 border-green-400/40 border-2 shadow-lg shadow-green-400/20' 
                  : 'bg-red-500/80 border-red-400/40 border-2 shadow-lg shadow-red-400/20'
              }`}>
                <div >
                  {potentialIncrease > 0 ? '💰 POTENTIAL GAIN' : '⚠️ POTENTIAL LOSS'}
                </div>
                <div >
                  {potentialIncrease > 0 ? '+' : '-'}${Math.abs(potentialIncrease).toLocaleString()}
                </div>
                <div >
                  {potentialIncrease > 0 ? '+' : '-'}{Math.abs(percentageIncrease).toFixed(1)}% {potentialIncrease > 0 ? 'increase' : 'decrease'}
                </div>
              </div>
            ) : (
              <div >
                <div >
                  Select a different grade to see potential impact
                </div>
                <div >
                  Use the grade buttons below to explore value changes
                </div>
              </div>
            )}
          </div>
        </div>
        
        <h3 >
          Click any grade to see how operational improvements impact your business value
        </h3>
        <div >
          {(['F', 'D', 'C', 'B', 'A'] as const).map((grade) => {
            const gradeInfo = getGradeInfo(grade);
            const isSelected = grade === sliderGrade;
            const isCurrent = grade === baseGrade;
            const valuation = calculateValuation(grade);
            
            return (
              <button
                key={grade}
                onClick={() => setSliderGrade(grade)}
                className={`relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 shadow-md bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                {isCurrent && (
                  <div >
                    <span >
                      Current
                    </span>
                  </div>
                )}
                {isSelected && !isCurrent && (
                  <div >
                    <span >
                      Selected
                    </span>
                  </div>
                )}
                
                <div >
                  {/* Icon Section */}
                  <div
                    className={`absolute -top-6 -left-2 z-10 w-12 h-12 rounded-xl flex items-center justify-center ${gradeInfo.bg} backdrop-blur-md border border-white/20 shadow-lg`}
                  >
                    <span >{grade}</span>
                  </div>
                  
                  {/* Content Section */}
                  <div >
                    <div >
                      {grade === 'F' ? 'Poor Performance' :
                       grade === 'D' ? 'Below Average' :
                       grade === 'C' ? 'Average Performance' :
                       grade === 'B' ? 'Good Performance' : 'Excellent Performance'}
                    </div>
                    <div >
                      {gradeInfo.multiplier.toFixed(1)}x
                    </div>
                    <div >
                      EBITDA Multiple
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div >
          <div >
            <div ></div>
            <span >Current Grade</span>
          </div>
          <div >
            <div ></div>
            <span >Selected Target</span>
          </div>
        </div>
        
        <p >
          Valuations based on EBITDA multiple × Click to select target grade
        </p>
      </div>
      {/* Call to Action */}
      {showBooking && (
        <div >
          <div >
            <h3 >
              Ready to Unlock Your Business Value?
            </h3>
            <p >
              By improving your operational grade from {baseGrade} to {sliderGrade}, 
              you could add <strong >${Math.round(potentialIncrease).toLocaleString()}</strong> to your business value.
            </p>
            <div >
              <Button 
                
                onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')}
              >
                <Phone  />
                Get Your Customized Value Roadmap
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Educational Content */}
      <div >
        <div >
          <h3 >
            How to Improve Your Operational Grade
          </h3>
        </div>
        <div >
          {/* Financial Performance - Grade A */}
          {(() => {
            const gradeInfo = getGradeInfo('A');
            return (
              <div className={`bg-gradient-to-br ${gradeInfo.gradient}
        rounded-xl p-4
        border ${gradeInfo.borderColor}
        backdrop-blur-md
        bg-white/10
        shadow-lg
        hover:shadow-xl
        transition-all duration-300 ease-in-out`}>
                <div >
                  <div className={`${gradeInfo.bg} bg-opacity-80 text-white px-2 py-1 rounded-full text-xs uppercase tracking-wider font-bold `}>
                    {gradeInfo.label}
                  </div>
                </div>
                <h4 >💰 Financial Performance</h4>
                <p >Consistent profitability, strong cash flow management, and professional financial reporting</p>
              </div>
            );
          })()}

          {/* Operational Excellence - Grade B */}
          {(() => {
            const gradeInfo = getGradeInfo('B');
            return (
              <div className={`bg-gradient-to-br ${gradeInfo.gradient}
        rounded-xl p-4
        border ${gradeInfo.borderColor}
        backdrop-blur-md
        bg-white/10
        shadow-lg
        hover:shadow-xl
        transition-all duration-300 ease-in-out`}>
                <div >
                  <div className={`${gradeInfo.bg} bg-opacity-90 text-white px-2 py-1 rounded-full text-xs uppercase tracking-wider font-bold `}>
                    {gradeInfo.label}
                  </div>
                </div>
                <h4 >⚙️ Operational Excellence</h4>
                <p >Streamlined processes, quality management systems, and scalable operations</p>
              </div>
            );
          })()}

          {/* Market Position - Grade C */}
          {(() => {
            const gradeInfo = getGradeInfo('C');
            return (
              <div className={`bg-gradient-to-br ${gradeInfo.gradient}
        rounded-xl p-4
        border ${gradeInfo.borderColor}
        backdrop-blur-md
        bg-white/10
        shadow-lg
        hover:shadow-xl
        transition-all duration-300 ease-in-out`}>
                <div >
                  <div className={`${gradeInfo.bg} bg-opacity-90 text-white px-2 py-1 rounded-full text-xs uppercase tracking-wider font-bold `}>
                    {gradeInfo.label}
                  </div>
                </div>
                <h4 >🎯 Market Position</h4>
                <p >Competitive differentiation, customer loyalty, and market share protection</p>
              </div>
            );
          })()}

          {/* Risk Management - Grades D-F */}
          {(() => {
            const gradeInfo = getGradeInfo('D');
            return (
              <div className={`bg-gradient-to-br ${gradeInfo.gradient}
                rounded-xl p-4
                border ${gradeInfo.borderColor}
                backdrop-blur-md
                bg-white/10
                shadow-lg
                hover:shadow-xl
                transition-all duration-300 ease-in-out`}>
                <div >
                  <div >
                    Grades D-F: {getMultipleForGrade('D').toFixed(1)}-{getMultipleForGrade('F').toFixed(1)}x
                  </div>
                </div>
                <h4 >🛡️ Risk Management</h4>
                <p >Diversified revenue streams, reduced owner dependency, and operational stability</p>
              </div>
            );
          })()}
        </div>

        {/* Final CTA Section */}
        <div >
          <h3 >
            Want to See How Much More Your Business Could Be Worth?
          </h3>
          <button 
            onClick={() => {
              // Open GoHighLevel booking widget in new tab
              window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank');
            }}
            
          >
            Explore Your Full Valuation Roadmap 
            <ArrowRight  />
          </button>
        </div>
      </div>
    </div>
  );
}