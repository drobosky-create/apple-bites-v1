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
    { grade: 'F', multiplier: 2.0, label: 'Poor', color: '#ef4444', height: 2 },
    { grade: 'D', multiplier: 3.0, label: 'Below Avg', color: '#f97316', height: 3 },
    { grade: 'C', multiplier: 4.2, label: 'Average', color: '#f59e0b', height: 4.2 },
    { grade: 'B', multiplier: 5.7, label: 'Good', color: '#3b82f6', height: 5.7 },
    { grade: 'A', multiplier: 7.5, label: 'Excellent', color: '#10b981', height: 7.5 }
  ] as const;

  const renderGradeStep = (gradeData: typeof grades[number], index: number) => {
    const isCurrent = gradeData.grade === currentGrade;
    const isSelected = gradeData.grade === selectedGrade;
    const isHovered = hoveredGrade === gradeData.grade;
    const valuation = getValuation(gradeData.grade as any);
    
    // Calculate bar height based on multiplier (max 7.5 = 150px)
    const barHeight = Math.max(40, (gradeData.multiplier / 7.5) * 150);
    
    return (
      <div
        key={gradeData.grade}
        className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-105"
        onClick={() => onGradeSelect(gradeData.grade as any)}
        onMouseEnter={() => setHoveredGrade(gradeData.grade)}
        onMouseLeave={() => setHoveredGrade(null)}
      >
        {/* Value Display Above Bar */}
        <div className={`mb-3 text-center transition-all duration-300 ${
          isSelected || isHovered ? 'scale-110' : 'scale-100'
        }`}>
          <div className={`text-lg font-bold ${
            isSelected ? 'text-blue-600' : isCurrent ? 'text-orange-600' : 'text-gray-700'
          }`}>
            ${(valuation / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-500">
            {gradeData.multiplier.toFixed(1)}x EBITDA
          </div>
        </div>

        {/* Vertical Bar representing stack */}
        <div className="relative flex flex-col justify-end items-center mb-4">
          <div
            className={`w-16 rounded-t-lg transition-all duration-300 ${
              isCurrent 
                ? 'shadow-lg shadow-orange-200' 
                : isSelected 
                ? 'shadow-lg shadow-blue-200'
                : 'shadow-md'
            } ${
              isSelected || isCurrent || isHovered ? 'opacity-100' : 'opacity-80'
            }`}
            style={{
              height: `${barHeight}px`,
              backgroundColor: gradeData.color,
              border: `3px solid ${
                isCurrent 
                  ? '#fb923c' 
                  : isSelected 
                  ? '#3b82f6'
                  : 'rgba(255,255,255,0.3)'
              }`,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          
          {/* Stack lines to simulate coins */}
          {Array.from({ length: Math.floor(gradeData.height) }, (_, lineIndex) => (
            <div
              key={lineIndex}
              className="absolute w-full border-t border-white/30"
              style={{
                bottom: `${(lineIndex + 1) * (barHeight / gradeData.height)}px`
              }}
            />
          ))}
          
          {/* Glow Effect for Current Grade */}
          {isCurrent && (
            <div 
              className="absolute inset-0 rounded-t-lg animate-pulse pointer-events-none"
              style={{
                boxShadow: `0 0 30px ${gradeData.color}60`,
                zIndex: -1
              }}
            />
          )}
          
          {/* Selection Ring */}
          {isSelected && gradeData.grade !== currentGrade && (
            <div 
              className="absolute inset-0 rounded-t-lg border-2 border-blue-400 pointer-events-none"
              style={{
                width: '110%',
                height: '105%',
                left: '-5%',
                bottom: '-2.5%',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
              }}
            />
          )}
        </div>

        {/* Grade Label */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            isSelected ? 'text-blue-600' : isCurrent ? 'text-orange-600' : 'text-gray-700'
          }`}>
            {gradeData.grade}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {gradeData.label}
          </div>
          
          {/* Current Badge */}
          {isCurrent && (
            <div className="mt-1">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
                You are here
              </span>
            </div>
          )}
          
          {/* Selected Badge */}
          {isSelected && gradeData.grade !== currentGrade && (
            <div className="mt-1">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                Selected
              </span>
            </div>
          )}
        </div>

        {/* Hover Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full mb-2 z-10 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg transform -translate-x-1/2 left-1/2 whitespace-nowrap">
            <div className="font-semibold">{gradeData.label} Operations</div>
            <div className="text-gray-200">
              Valuation: ${(valuation / 1000000).toFixed(2)}M
            </div>
            <div className="text-gray-200">
              {gradeData.multiplier.toFixed(1)}x EBITDA Multiple
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Chart Title */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Valuation Growth by Operational Grade
        </h3>
        <p className="text-gray-600">
          Click any grade to see how operational improvements impact your business value
        </p>
      </div>

      {/* Grade Steps */}
      <div className="flex justify-center items-end space-x-6 py-8 px-4 bg-gradient-to-b from-blue-50 to-white rounded-xl border border-gray-200">
        {grades.map((gradeData, index) => renderGradeStep(gradeData, index))}
      </div>

      {/* Legend */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p className="mb-2">
          <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
          Current Grade
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2 ml-6"></span>
          Selected Target
        </p>
        <p className="text-xs text-gray-500">
          Bar height represents EBITDA multiple • Hover for detailed valuations
        </p>
      </div>
    </div>
  );
}