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
  
  // Define grade segments with colors and angles (semi-circle from 0 to 180 degrees)
  const gradeSegments = [
    { grade: 'F', color: 'bg-red-500', angle: 0, label: 'Poor' },
    { grade: 'D', color: 'bg-orange-400', angle: 36, label: 'Below Average' },
    { grade: 'C', color: 'bg-yellow-300', angle: 72, label: 'Average' },
    { grade: 'B', color: 'bg-sky-400', angle: 108, label: 'Good' },
    { grade: 'A', color: 'bg-emerald-500', angle: 144, label: 'Excellent' },
  ];

  // Get target angle for current grade (semi-circle from 0 to 180 degrees)
  const getTargetAngle = (currentGrade: string) => {
    const segment = gradeSegments.find(s => s.grade === currentGrade);
    return segment ? segment.angle + 18 : 18; // Add 18 to center needle in segment (180/5 = 36, so half is 18)
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

  // Create SVG path for arc segments (semi-circle from left to right)
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const centerX = 150;
    const centerY = 120;
    
    // Convert to semi-circle: 0° = left (180° in normal coords), 180° = right (0° in normal coords)
    const startAngleRad = (startAngle + 180) * (Math.PI / 180);
    const endAngleRad = (endAngle + 180) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Get needle position (semi-circle coordinates)
  const needleAngle = animatedAngle;
  const needleAngleRad = (needleAngle + 180) * (Math.PI / 180);
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
        <svg width="300" height="160" viewBox="0 0 300 160" className="overflow-visible">
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d={createArcPath(0, 180, 80)}
            fill="url(#backgroundGradient)"
            stroke="rgb(226, 232, 240)"
            strokeWidth="1"
          />
          
          {/* Grade segments */}
          {gradeSegments.map((segment, index) => {
            const startAngle = segment.angle;
            const endAngle = index < gradeSegments.length - 1 ? gradeSegments[index + 1].angle : 180;
            const isActive = segment.grade === grade;
            
            const gradientId = 
              segment.grade === 'F' ? 'redGradient' :
              segment.grade === 'D' ? 'orangeGradient' :
              segment.grade === 'C' ? 'yellowGradient' :
              segment.grade === 'B' ? 'blueGradient' :
              'greenGradient';
            
            return (
              <g key={segment.grade}>
                <path
                  d={createArcPath(startAngle, endAngle, 80)}
                  fill={isActive ? `url(#${gradientId})` : 'rgb(248, 250, 252)'}
                  stroke="white"
                  strokeWidth="3"
                  className="transition-all duration-300"
                  style={{
                    filter: isActive ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none',
                    opacity: isActive ? 1 : 0.3
                  }}
                />
                
                {/* Grade labels */}
                <text
                  x={centerX + 95 * Math.cos((segment.angle + 18 + 180) * (Math.PI / 180))}
                  y={centerY + 95 * Math.sin((segment.angle + 18 + 180) * (Math.PI / 180))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-lg font-bold ${isActive ? 'fill-white' : 'fill-gray-400'}`}
                >
                  {segment.grade}
                </text>
              </g>
            );
          })}
          
          {/* Needle with gradient */}
          <g className="transition-transform duration-1000 ease-out">
            <defs>
              <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>
            <line
              x1={centerX}
              y1={centerY}
              x2={needleX}
              y2={needleY}
              stroke="url(#needleGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
            />
            
            {/* Needle center dot with gradient */}
            <circle
              cx={centerX}
              cy={centerY}
              r="8"
              fill="url(#needleGradient)"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
            />
            <circle
              cx={centerX}
              cy={centerY}
              r="4"
              fill="white"
            />
          </g>
          
          {/* Tick marks */}
          {gradeSegments.map((segment) => {
            const tickAngle = segment.angle;
            const tickAngleRad = (tickAngle + 180) * (Math.PI / 180);
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
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>

      {/* Valuation Display Below Gauge */}
      <div className="flex justify-center mt-6">
        <div className="grid grid-cols-5 gap-6 text-center">
          {(['F', 'D', 'C', 'B', 'A'] as const).map((displayGrade) => {
            const gradeInfo = gradeSegments.find(s => s.grade === displayGrade);
            if (!gradeInfo) return null;
            
            const valuation = 3500000; // Base EBITDA for demo
            const multiplier = 
              displayGrade === 'F' ? 2.0 :
              displayGrade === 'D' ? 3.0 :
              displayGrade === 'C' ? 4.2 :
              displayGrade === 'B' ? 5.7 :
              7.5;
            
            const calculatedValue = valuation * multiplier;
            const isCurrentGrade = displayGrade === grade;
            
            return (
              <div key={displayGrade} className="relative">
                {isCurrentGrade && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Current
                    </span>
                  </div>
                )}
                <div className={`text-2xl font-bold mb-1 ${isCurrentGrade ? 'text-slate-800' : 'text-slate-600'}`}>
                  ${(calculatedValue / 1000000).toFixed(1)}M
                </div>
                <div className={`text-sm mb-2 ${isCurrentGrade ? 'text-slate-600' : 'text-slate-500'}`}>
                  {multiplier.toFixed(1)}x
                </div>
                <div className={`text-xs uppercase tracking-wide ${isCurrentGrade ? 'text-slate-700' : 'text-slate-500'}`}>
                  EBITDA
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OperationalGradeGauge;