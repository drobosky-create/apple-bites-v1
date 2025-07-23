import { useState } from 'react';

interface ModernGradeChartProps {
  currentGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  onGradeSelect: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => void;
  selectedGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  getValuation: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => number;
  getMultiple: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => number;
}

export default function ModernGradeChart({ 
  currentGrade, 
  onGradeSelect, 
  selectedGrade, 
  getValuation, 
  getMultiple 
}: ModernGradeChartProps) {
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);

  const grades = [
    { grade: 'F', label: 'Poor', color: 'rgb(239, 68, 68)', bgColor: 'rgb(254, 242, 242)', borderColor: 'rgb(252, 165, 165)' },
    { grade: 'D', label: 'Below Average', color: 'rgb(249, 115, 22)', bgColor: 'rgb(255, 247, 237)', borderColor: 'rgb(253, 186, 116)' },
    { grade: 'C', label: 'Average', color: 'rgb(245, 158, 11)', bgColor: 'rgb(255, 251, 235)', borderColor: 'rgb(252, 211, 77)' },
    { grade: 'B', label: 'Good', color: 'rgb(59, 130, 246)', bgColor: 'rgb(239, 246, 255)', borderColor: 'rgb(147, 197, 253)' },
    { grade: 'A', label: 'Excellent', color: 'rgb(16, 185, 129)', bgColor: 'rgb(236, 253, 245)', borderColor: 'rgb(110, 231, 183)' }
  ] as const;

  const renderGradeCard = (gradeData: typeof grades[number]) => {
    const isCurrent = gradeData.grade === currentGrade;
    const isSelected = gradeData.grade === selectedGrade;
    const isHovered = hoveredGrade === gradeData.grade;
    const valuation = getValuation(gradeData.grade as any);
    const multiple = getMultiple(gradeData.grade as any);

    return (
      <div
        key={gradeData.grade}
        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
          isSelected 
            ? 'border-blue-400 shadow-xl shadow-blue-200/30 bg-gradient-to-br from-blue-50/80 to-indigo-50/50' 
            : isCurrent 
            ? 'border-orange-400 shadow-xl shadow-orange-200/30 bg-gradient-to-br from-orange-50/80 to-amber-50/50'
            : 'border-slate-200 shadow-lg hover:border-slate-300 bg-white/70'
        }`}
        onClick={() => onGradeSelect(gradeData.grade as any)}
        onMouseEnter={() => setHoveredGrade(gradeData.grade)}
        onMouseLeave={() => setHoveredGrade(null)}
      >
        {/* Status Badge */}
        {(isCurrent || isSelected) && (
          <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white ${
            isCurrent ? 'bg-orange-500' : 'bg-blue-500'
          }`}>
            {isCurrent ? 'Current' : 'Selected'}
          </div>
        )}

        {/* Grade Circle */}
        <div className="flex justify-center mb-4">
          <div 
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg ${
              isSelected || isCurrent ? 'ring-4 ring-white' : ''
            }`}
            style={{ backgroundColor: gradeData.color }}
          >
            {gradeData.grade}
          </div>
        </div>

        {/* Valuation Display */}
        <div className="text-center mb-3">
          <div className={`text-2xl font-bold mb-1 ${
            isSelected ? 'text-blue-700' : isCurrent ? 'text-orange-700' : 'text-slate-800'
          }`}>
            ${(valuation / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-slate-600 font-medium">
            {multiple.toFixed(1)}x EBITDA
          </div>
        </div>

        {/* Label */}
        <div className="text-center">
          <div className={`text-lg font-semibold ${
            isSelected ? 'text-blue-700' : isCurrent ? 'text-orange-700' : 'text-slate-700'
          }`}>
            {gradeData.label}
          </div>
        </div>

        {/* Hover Effect Glow */}
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-2xl animate-pulse pointer-events-none opacity-30"
            style={{
              boxShadow: `0 0 40px ${gradeData.color}`,
              zIndex: -1
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Chart Title */}
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3 tracking-wide">
          Operational Grade Impact Analysis
        </h3>
        <p className="text-base sm:text-lg text-[#475569] font-medium">
          Click any grade to see how operational improvements impact your business value
        </p>
      </div>

      {/* Grade Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {grades.map(renderGradeCard)}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Current Grade</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Selected Target</span>
        </div>
        <div className="text-xs text-slate-500">
          Valuations based on EBITDA multiple × Hover for details
        </div>
      </div>
    </div>
  );
}