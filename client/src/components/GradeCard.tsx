import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
type OperationalGrade = 'A' | 'B' | 'C' | 'D' | 'F';

interface HorizontalGradeSelectorProps {
  baseGrade: OperationalGrade;
  sliderGrade: OperationalGrade;
  setSliderGrade: (grade: OperationalGrade) => void;
  baseEstimate: number;
  sliderEstimate: number;
}

const gradeData = [
  { grade: 'F' as OperationalGrade, multiple: '2.0x', label: 'Poor', description: 'Poor operations with significant challenges' },
  { grade: 'D' as OperationalGrade, multiple: '3.0x', label: 'Below Average', description: 'Below average operational performance' },
  { grade: 'C' as OperationalGrade, multiple: '4.2x', label: 'Average', description: 'Average operations meeting basic standards' },
  { grade: 'B' as OperationalGrade, multiple: '5.7x', label: 'Good', description: 'Good operations with strong performance' },
  { grade: 'A' as OperationalGrade, multiple: '7.5x', label: 'Excellent', description: 'Excellent operations with superior performance' },
];

// Argon gradient color mapping based on authentic Argon Dashboard colors
const getGradientStyle = (grade: string, isSelected: boolean, isCurrent: boolean) => {
  if (isCurrent) {
    // Argon warning/primary gradient for current grade
    return {
      background: 'linear-gradient(310deg, #fb6340, #fbb140)',
      color: '#ffffff',
      transform: 'scale(1.05)',
      boxShadow: '0 8px 26px -4px rgba(251, 99, 64, 0.4)',
    };
  }
  
  if (isSelected) {
    // Argon primary gradient for selected grade
    return {
      background: 'linear-gradient(310deg, #5e72e4, #825ee4)',
      color: '#ffffff',
      transform: 'scale(1.02)',
      boxShadow: '0 8px 26px -4px rgba(94, 114, 228, 0.4)',
    };
  }
  
  // Default Argon light gradient
  return {
    background: 'linear-gradient(310deg, #ced4da, #ebeff4)',
    color: '#344767',
    transform: 'scale(1)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.12)',
  };
};

const GradeCard: React.FC<HorizontalGradeSelectorProps> = ({
  baseGrade,
  sliderGrade,
  setSliderGrade,
  baseEstimate,
  sliderEstimate,
}) => {
  const [hoveredGrade, setHoveredGrade] = useState<OperationalGrade | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-900/5 border border-white/30 p-8 sm:p-12">
      {/* Header Section with Argon Typography */}
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#344767] mb-4 tracking-wide flex items-center justify-center gap-3">
          <TrendingUp className="h-8 w-8 text-[#5e72e4]" />
          Interactive Grade Assessment
        </h3>
        <p className="text-lg sm:text-xl text-[#67748e] leading-relaxed font-medium">
          Click any grade below to explore how operational improvements impact your business valuation
        </p>
      </div>

      {/* Current vs Projected Display */}
      <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/60 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/50 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div>
            <div className="text-sm font-semibold text-[#67748e] mb-2">Current Valuation (Grade {baseGrade})</div>
            <div className="text-2xl font-bold text-[#344767]">{formatCurrency(baseEstimate)}</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#67748e] mb-2">Projected Valuation (Grade {sliderGrade})</div>
            <div className="text-2xl font-bold text-[#5e72e4]">{formatCurrency(sliderEstimate)}</div>
          </div>
        </div>
        
        {/* Improvement Indicator */}
        {sliderEstimate !== baseEstimate && (
          <div className="text-center mt-4">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              sliderEstimate > baseEstimate 
                ? 'bg-[#2dce89]/10 text-[#2dce89] border border-[#2dce89]/20' 
                : 'bg-[#f5365c]/10 text-[#f5365c] border border-[#f5365c]/20'
            }`}>
              {sliderEstimate > baseEstimate ? '+' : ''}{formatCurrency(sliderEstimate - baseEstimate)} change
            </div>
          </div>
        )}
      </div>

      {/* Grade Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {gradeData.map((item) => {
          const isCurrent = item.grade === baseGrade;
          const isSelected = item.grade === sliderGrade;
          const isHovered = hoveredGrade === item.grade;
          const gradientStyle = getGradientStyle(item.grade, isSelected, isCurrent);
          
          return (
            <div
              key={item.grade}
              className="relative group cursor-pointer"
              onClick={() => setSliderGrade(item.grade)}
              onMouseEnter={() => setHoveredGrade(item.grade)}
              onMouseLeave={() => setHoveredGrade(null)}
            >
              {/* Grade Card with Argon Styling */}
              <div
                className="relative p-6 rounded-xl text-center transition-all duration-300 ease-in-out hover:scale-105 border border-white/20"
                style={gradientStyle}
              >
                {/* Current Badge */}
                {isCurrent && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-[#fb6340] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                      Current
                    </div>
                  </div>
                )}
                
                {/* Grade Letter */}
                <div className="text-4xl font-bold mb-2">{item.grade}</div>
                
                {/* Multiple */}
                <div className="text-sm font-semibold mb-1">{item.multiple}</div>
                
                {/* Label */}
                <div className="text-xs font-medium opacity-90">{item.label}</div>
              </div>

              {/* Tooltip with Argon Styling */}
              <div className={`absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 px-4 py-3 bg-[#344767] text-white text-sm rounded-lg shadow-xl z-20 whitespace-nowrap transition-opacity duration-200 pointer-events-none ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="font-semibold mb-1">Grade {item.grade}: {item.multiple}</div>
                <div className="text-xs opacity-90">{item.description}</div>
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#344767]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-8">
        <p className="text-sm text-[#67748e] leading-relaxed">
          Each grade represents operational excellence levels that directly impact business valuation multiples. 
          Click any grade to see the potential impact on your business value.
        </p>
      </div>
    </div>
  );
};

export default GradeCard;