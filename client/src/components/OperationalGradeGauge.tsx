import React, { useEffect, useState } from 'react';

interface OperationalGradeGaugeProps {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  title?: string;
  animated?: boolean;
}

const OperationalGradeGauge: React.FC<OperationalGradeGaugeProps> = ({ 
  grade, 
  title = "Operational Grade",
  animated = true 
}) => {
  const [animatedAngle, setAnimatedAngle] = useState(0);
  
  // Define grade segments with colors and angles
  const gradeSegments = [
    { grade: 'F', color: 'bg-red-500', angle: 0, label: 'Poor' },
    { grade: 'D', color: 'bg-orange-400', angle: 36, label: 'Below Average' },
    { grade: 'C', color: 'bg-yellow-300', angle: 72, label: 'Average' },
    { grade: 'B', color: 'bg-sky-400', angle: 108, label: 'Good' },
    { grade: 'A', color: 'bg-emerald-500', angle: 144, label: 'Excellent' },
  ];

  // Get target angle for current grade
  const getTargetAngle = (currentGrade: string) => {
    const segment = gradeSegments.find(s => s.grade === currentGrade);
    return segment ? segment.angle + 18 : 18; // Add 18 to center needle in segment
  };

  const targetAngle = getTargetAngle(grade);

  // Animate needle on mount and grade change
  useEffect(() => {
    if (animated) {
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();
      const startAngle = animatedAngle;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentAngle = startAngle + (targetAngle - startAngle) * easeOut;
        
        setAnimatedAngle(currentAngle);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setAnimatedAngle(targetAngle);
    }
  }, [grade, targetAngle, animated]);

  // Create SVG path for arc segments
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const centerX = 150;
    const centerY = 120;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Get needle position
  const needleAngle = animatedAngle;
  const needleAngleRad = (needleAngle - 90) * (Math.PI / 180);
  const needleLength = 75;
  const centerX = 150;
  const centerY = 120;
  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
  const needleY = centerY + needleLength * Math.sin(needleAngleRad);

  // Get current grade info
  const currentSegment = gradeSegments.find(s => s.grade === grade);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      {/* Title */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">Current Performance Level</p>
      </div>

      {/* Gauge Container */}
      <div className="relative flex justify-center">
        <svg width="300" height="180" viewBox="0 0 300 180" className="overflow-visible">
          {/* Background arc */}
          <path
            d={createArcPath(0, 180, 80)}
            fill="rgb(241, 245, 249)"
            stroke="rgb(226, 232, 240)"
            strokeWidth="1"
          />
          
          {/* Grade segments */}
          {gradeSegments.map((segment, index) => {
            const startAngle = segment.angle;
            const endAngle = index < gradeSegments.length - 1 ? gradeSegments[index + 1].angle : 180;
            const isActive = segment.grade === grade;
            
            return (
              <g key={segment.grade}>
                <path
                  d={createArcPath(startAngle, endAngle, 80)}
                  fill={isActive ? 
                    segment.grade === 'F' ? 'rgb(239, 68, 68)' :
                    segment.grade === 'D' ? 'rgb(251, 146, 60)' :
                    segment.grade === 'C' ? 'rgb(250, 204, 21)' :
                    segment.grade === 'B' ? 'rgb(56, 189, 248)' :
                    'rgb(34, 197, 94)'
                    : 'rgb(248, 250, 252)'
                  }
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-300"
                  style={{
                    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none'
                  }}
                />
                
                {/* Grade labels */}
                <text
                  x={centerX + 95 * Math.cos((segment.angle + 18 - 90) * (Math.PI / 180))}
                  y={centerY + 95 * Math.sin((segment.angle + 18 - 90) * (Math.PI / 180))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-sm font-semibold ${isActive ? 'fill-gray-800' : 'fill-gray-500'}`}
                >
                  {segment.grade}
                </text>
              </g>
            );
          })}
          
          {/* Needle */}
          <g className="transition-transform duration-1000 ease-out">
            <line
              x1={centerX}
              y1={centerY}
              x2={needleX}
              y2={needleY}
              stroke="rgb(30, 41, 59)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Needle center dot */}
            <circle
              cx={centerX}
              cy={centerY}
              r="6"
              fill="rgb(30, 41, 59)"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r="3"
              fill="white"
            />
          </g>
          
          {/* Tick marks */}
          {gradeSegments.map((segment) => {
            const tickAngle = segment.angle;
            const tickAngleRad = (tickAngle - 90) * (Math.PI / 180);
            const innerRadius = 65;
            const outerRadius = 75;
            
            const x1 = centerX + innerRadius * Math.cos(tickAngleRad);
            const y1 = centerY + innerRadius * Math.sin(tickAngleRad);
            const x2 = centerX + outerRadius * Math.cos(tickAngleRad);
            const y2 = centerY + outerRadius * Math.sin(tickAngleRad);
            
            return (
              <line
                key={`tick-${segment.grade}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgb(148, 163, 184)"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      {/* Grade info */}
      <div className="text-center mt-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`w-4 h-4 rounded-full ${currentSegment?.color || 'bg-gray-300'}`}></div>
          <span className="text-2xl font-bold text-gray-800">{grade}</span>
        </div>
        <p className="text-sm font-medium text-gray-600">
          {currentSegment?.label || 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default OperationalGradeGauge;