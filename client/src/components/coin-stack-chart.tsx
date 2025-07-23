import { useState } from 'react';

interface CoinStackChartProps {
  currentGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  onGradeSelect: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => void;
  selectedGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  getValuation: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => number;
  getMultiple: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => number;
}

export default function CoinStackChart({ 
  currentGrade, 
  onGradeSelect, 
  selectedGrade, 
  getValuation, 
  getMultiple 
}: CoinStackChartProps) {
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);

  const grades = [
    { grade: 'F', multiplier: 2.0, label: 'Poor', color: '#ef4444', coins: 2 },
    { grade: 'D', multiplier: 3.0, label: 'Below Avg', color: '#f97316', coins: 3 },
    { grade: 'C', multiplier: 4.2, label: 'Average', color: '#f59e0b', coins: 4.2 },
    { grade: 'B', multiplier: 5.7, label: 'Good', color: '#3b82f6', coins: 5.7 },
    { grade: 'A', multiplier: 7.5, label: 'Excellent', color: '#10b981', coins: 7.5 }
  ] as const;

  const renderCoinStack = (gradeData: typeof grades[number], index: number) => {
    const isCurrent = gradeData.grade === currentGrade;
    const isSelected = gradeData.grade === selectedGrade;
    const isHovered = hoveredGrade === gradeData.grade;
    const valuation = getValuation(gradeData.grade as any);
    
    // Calculate stack height based on multiplier (max 7.5)
    const stackHeight = Math.max(60, (gradeData.multiplier / 7.5) * 120);
    const coinCount = Math.ceil(gradeData.coins);
    
    return (
      <div
        key={gradeData.grade}
        className="flex flex-col items-center cursor-pointer group"
        onClick={() => onGradeSelect(gradeData.grade as any)}
        onMouseEnter={() => setHoveredGrade(gradeData.grade)}
        onMouseLeave={() => setHoveredGrade(null)}
      >
        {/* Value Display Above Stack */}
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

        {/* Coin Stack */}
        <div 
          className={`relative flex flex-col-reverse items-center transition-all duration-300 ${
            isSelected || isHovered ? 'scale-110' : 'scale-100'
          }`}
          style={{ height: `${stackHeight}px` }}
        >
          {Array.from({ length: coinCount }, (_, coinIndex) => (
            <div
              key={coinIndex}
              className={`w-12 h-4 rounded-full border-2 transition-all duration-300 ${
                isCurrent 
                  ? 'border-orange-400 shadow-lg shadow-orange-200' 
                  : isSelected 
                  ? 'border-blue-400 shadow-lg shadow-blue-200'
                  : 'border-gray-300'
              }`}
              style={{
                backgroundColor: gradeData.color,
                marginTop: coinIndex > 0 ? '-6px' : '0',
                opacity: isSelected || isCurrent || isHovered ? 1 : 0.8,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
          ))}
          
          {/* Glow Effect for Current Grade */}
          {isCurrent && (
            <div 
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                boxShadow: `0 0 20px ${gradeData.color}40`,
                zIndex: -1
              }}
            />
          )}
          
          {/* Selection Ring */}
          {isSelected && gradeData.grade !== currentGrade && (
            <div 
              className="absolute inset-0 rounded-full border-2 border-blue-400"
              style={{
                width: '120%',
                height: '120%',
                left: '-10%',
                top: '-10%',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
              }}
            />
          )}
        </div>

        {/* Grade Label */}
        <div className="mt-3 text-center">
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
          <div className="absolute top-0 z-10 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg transform -translate-y-full -translate-x-1/2 left-1/2">
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
          Valuation Growth Stack
        </h3>
        <p className="text-gray-600">
          Click any grade to see how operational improvements impact your business value
        </p>
      </div>

      {/* Coin Stacks */}
      <div className="flex justify-center items-end space-x-8 py-8 px-4 bg-gradient-to-b from-blue-50 to-white rounded-xl border border-gray-200">
        {grades.map((gradeData, index) => renderCoinStack(gradeData, index))}
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
          Stack height represents EBITDA multiple • Hover for detailed valuations
        </p>
      </div>
    </div>
  );
}