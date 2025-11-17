import { motion } from 'motion/react';

interface ChoreWheelProps {
  names: string[];
  tasks: string[];
  assignments: Record<string, string>;
  rotation?: number;
}

export function ChoreWheel({ names, tasks, assignments, rotation = 0 }: ChoreWheelProps) {
  const items = names.length > 0 ? names : ['Add', 'Some', 'Names'];
  const segmentAngle = 360 / items.length;
  
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ];

  // Helper function to create path for inner wheel segment
  const createInnerSegmentPath = (index: number, total: number) => {
    const angle = (2 * Math.PI) / total;
    const startAngle = index * angle - Math.PI / 2;
    const endAngle = (index + 1) * angle - Math.PI / 2;
    
    const x1 = 200 + 120 * Math.cos(startAngle);
    const y1 = 200 + 120 * Math.sin(startAngle);
    const x2 = 200 + 120 * Math.cos(endAngle);
    const y2 = 200 + 120 * Math.sin(endAngle);
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    return `M 200 200 L ${x1} ${y1} A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Helper function to create path for outer wheel segment
  const createOuterSegmentPath = (index: number, total: number) => {
    const angle = (2 * Math.PI) / total;
    const startAngle = index * angle - Math.PI / 2;
    const endAngle = (index + 1) * angle - Math.PI / 2;
    
    const innerRadius = 125;
    const outerRadius = 190;
    
    const x1Inner = 200 + innerRadius * Math.cos(startAngle);
    const y1Inner = 200 + innerRadius * Math.sin(startAngle);
    const x2Inner = 200 + innerRadius * Math.cos(endAngle);
    const y2Inner = 200 + innerRadius * Math.sin(endAngle);
    
    const x1Outer = 200 + outerRadius * Math.cos(startAngle);
    const y1Outer = 200 + outerRadius * Math.sin(startAngle);
    const x2Outer = 200 + outerRadius * Math.cos(endAngle);
    const y2Outer = 200 + outerRadius * Math.sin(endAngle);
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    return `M ${x1Inner} ${y1Inner} L ${x1Outer} ${y1Outer} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer} L ${x2Inner} ${y2Inner} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner} Z`;
  };

  // Helper function to get text position for inner wheel (names)
  const getInnerTextPosition = (index: number, total: number) => {
    const angle = (2 * Math.PI) / total;
    const midAngle = (index + 0.5) * angle - Math.PI / 2;
    const radius = 80;
    
    const x = 200 + radius * Math.cos(midAngle);
    const y = 200 + radius * Math.sin(midAngle);
    let rotation = (midAngle * 180) / Math.PI + 90;
    
    // Keep text upright by flipping text on the left side of the wheel
    if (rotation > 90 && rotation < 270) {
      rotation = rotation + 180;
    }
    
    return { x, y, rotation };
  };

  // Helper function to get text position for outer wheel (chores)
  const getOuterTextPosition = (index: number, total: number) => {
    const angle = (2 * Math.PI) / total;
    const midAngle = (index + 0.5) * angle - Math.PI / 2;
    const radius = 157.5; // Midpoint between inner and outer radius
    
    const x = 200 + radius * Math.cos(midAngle);
    const y = 200 + radius * Math.sin(midAngle);
    let rotation = (midAngle * 180) / Math.PI + 90;
    
    // Keep text upright by flipping text on the left side of the wheel
    if (rotation > 90 && rotation < 270) {
      rotation = rotation + 180;
    }
    
    return { x, y, rotation };
  };

  return (
    <div className="relative w-96 h-96">
      <motion.svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        className="drop-shadow-2xl"
        animate={{ rotate: rotation }}
        transition={{ type: 'spring', stiffness: 60, damping: 15, duration: 1 }}
      >
        {/* Inner wheel segments (Names) */}
        {items.map((item, index) => {
          const path = createInnerSegmentPath(index, items.length);
          const color = colors[index % colors.length];
          const textPos = getInnerTextPosition(index, items.length);
          
          return (
            <g key={`inner-${index}`}>
              {/* Inner segment */}
              <path
                d={path}
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
              
              {/* Name text */}
              <text
                x={textPos.x}
                y={textPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                fill="white"
                fontSize="16"
                fontWeight="600"
              >
                {item}
              </text>
            </g>
          );
        })}

        {/* Outer wheel segments (Chores) */}
        {items.map((item, index) => {
          const path = createOuterSegmentPath(index, items.length);
          const color = colors[index % colors.length];
          const textPos = getOuterTextPosition(index, items.length);
          const chore = assignments[item];
          
          return (
            <g key={`outer-${index}`}>
              {/* Outer segment */}
              <path
                d={path}
                fill={color}
                fillOpacity="0.7"
                stroke="white"
                strokeWidth="2"
              />
              
              {/* Chore text */}
              {chore && (
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                  fill="white"
                  fontSize="13"
                  fontWeight="600"
                >
                  {chore}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Center circle */}
        <circle
          cx="200"
          cy="200"
          r="30"
          fill="white"
          stroke="#D1D5DB"
          strokeWidth="3"
        />
        <circle
          cx="200"
          cy="200"
          r="6"
          fill="#1F2937"
        />
      </motion.svg>
      
      {/* Pointer */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-500 z-20 drop-shadow-lg" />
    </div>
  );
}