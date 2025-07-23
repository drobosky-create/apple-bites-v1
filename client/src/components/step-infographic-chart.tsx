import { useState } from 'react';

interface StepInfographicChartProps {
  currentGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  onGradeSelect: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => void;
  selectedGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  getValuation: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => number;
  getMultiple: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => number;
}

export default function StepInfographicChart({ 
  currentGrade, 
  onGradeSelect, 
  selectedGrade, 
  getValuation, 
  getMultiple 
}: StepInfographicChartProps) {
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);

  const grades = [
    { 
      grade: 'F', 
      multiplier: 2.0, 
      label: 'Poor Operations', 
      color: '#ef4444',
      darkColor: '#dc2626',
      icon: '⚠️',
      height: 60
    },
    { 
      grade: 'D', 
      multiplier: 3.0, 
      label: 'Below Average', 
      color: '#f97316',
      darkColor: '#ea580c',
      icon: '📉',
      height: 80
    },
    { 
      grade: 'C', 
      multiplier: 4.2, 
      label: 'Average Operations', 
      color: '#f59e0b',
      darkColor: '#d97706',
      icon: '⚖️',
      height: 100
    },
    { 
      grade: 'B', 
      multiplier: 5.7, 
      label: 'Good Operations', 
      color: '#22c55e',
      darkColor: '#16a34a',
      icon: '📈',
      height: 120
    },
    { 
      grade: 'A', 
      multiplier: 7.5, 
      label: 'Excellent Operations', 
      color: '#10b981',
      darkColor: '#059669',
      icon: '🎯',
      height: 140
    }
  ] as const;

  const renderStep = (gradeData: typeof grades[number], index: number) => {
    const isCurrent = gradeData.grade === currentGrade;
    const isSelected = gradeData.grade === selectedGrade;
    const isHovered = hoveredGrade === gradeData.grade;
    const valuation = getValuation(gradeData.grade as any);
    
    return (
      <div
        key={gradeData.grade}
        className="relative flex-1 cursor-pointer transition-all duration-300 hover:scale-105"
        onClick={() => onGradeSelect(gradeData.grade as any)}
        onMouseEnter={() => setHoveredGrade(gradeData.grade)}
        onMouseLeave={() => setHoveredGrade(null)}
        style={{ zIndex: 5 - index }}
      >
        {/* 3D Step Container */}
        <div 
          className="relative w-full transition-all duration-300"
          style={{ 
            height: `${gradeData.height + (isSelected || isHovered ? 20 : 0)}px`,
            transform: isSelected || isHovered ? 'translateY(-10px)' : 'translateY(0)'
          }}
        >
          {/* Top Face */}
          <div 
            className={`absolute top-0 left-0 w-full h-12 flex items-center justify-center text-white font-bold text-4xl border-2 transition-all duration-300 ${
              isCurrent ? 'border-orange-400 shadow-lg shadow-orange-200/50' : 
              isSelected ? 'border-blue-400 shadow-lg shadow-blue-200/50' : 
              'border-transparent'
            }`}
            style={{
              background: `linear-gradient(135deg, ${gradeData.color} 0%, ${gradeData.darkColor} 100%)`,
              clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
              boxShadow: isSelected || isCurrent ? 
                `0 -5px 15px ${gradeData.color}40, inset 0 2px 4px rgba(255,255,255,0.3)` :
                'inset 0 2px 4px rgba(255,255,255,0.3)'
            }}
          >
            <div className="text-2xl">{gradeData.icon}</div>
          </div>

          {/* Main Body - 3D Step */}
          <div 
            className="absolute top-12 left-0 w-full flex flex-col justify-center items-center text-white font-semibold transition-all duration-300"
            style={{
              height: `${gradeData.height - 12}px`,
              background: `linear-gradient(135deg, ${gradeData.color} 0%, ${gradeData.darkColor} 100%)`,
              clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.2),
                inset 0 -2px 4px rgba(0,0,0,0.2),
                5px 5px 15px rgba(0,0,0,0.3)
              `
            }}
          >
            {/* Grade Number */}
            <div className="text-4xl font-black mb-2 text-shadow">
              {String(index + 1).padStart(2, '0')}
            </div>
            
            {/* Grade Letter */}
            <div className="text-3xl font-black mb-2 text-shadow">
              {gradeData.grade}
            </div>

            {/* Valuation */}
            <div className="text-lg font-bold mb-1 text-center px-2">
              ${(valuation / 1000000).toFixed(1)}M
            </div>
            
            {/* Multiple */}
            <div className="text-sm font-semibold mb-2 opacity-90">
              {gradeData.multiplier.toFixed(1)}x
            </div>

            {/* Label */}
            <div className="text-xs font-medium text-center px-2 leading-tight opacity-90">
              {gradeData.label}
            </div>
          </div>

          {/* Current Badge */}
          {isCurrent && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                YOU ARE HERE
              </div>
            </div>
          )}

          {/* Selected Badge */}
          {isSelected && gradeData.grade !== currentGrade && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                SELECTED
              </div>
            </div>
          )}

          {/* Hover Tooltip */}
          {isHovered && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-center min-w-48">
              <div className="font-bold text-lg mb-1">{gradeData.label}</div>
              <div className="text-sm mb-1">Valuation: ${(valuation / 1000000).toFixed(2)}M</div>
              <div className="text-sm">{gradeData.multiplier.toFixed(1)}x EBITDA Multiple</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}

          {/* Glow Effect for Current/Selected */}
          {(isCurrent || isSelected) && (
            <div 
              className="absolute inset-0 rounded-lg -z-10 blur-xl opacity-50"
              style={{
                background: isCurrent ? 'orange' : 'blue',
                animation: 'pulse 2s infinite'
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Chart Title */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          Business Valuation Growth Steps
        </h3>
        <p className="text-gray-600 text-lg">
          Click any step to see how operational improvements impact your business value
        </p>
      </div>

      {/* 3D Steps Container */}
      <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-8 shadow-inner">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Steps */}
        <div className="relative flex items-end justify-center gap-4 min-h-48">
          {grades.map((gradeData, index) => renderStep(gradeData, index))}
        </div>

        {/* Base Line */}
        <div className="absolute bottom-8 left-8 right-8 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full shadow-inner" />
      </div>

      {/* Legend */}
      <div className="mt-6 text-center">
        <div className="flex justify-center items-center gap-6 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full shadow-md"></div>
            <span>Current Grade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-md"></div>
            <span>Selected Target</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          3D step height represents EBITDA multiple • Click any step to explore value improvement
        </p>
      </div>

      <style>{`
        .text-shadow {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}