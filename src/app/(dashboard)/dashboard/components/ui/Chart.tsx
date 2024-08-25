import React, { useEffect, useState } from 'react';

interface SimpleGaugeProps {
  value: number;
  valueMin: number;
  valueMax: number;
  color: string;
} 

const SimpleGauge: React.FC<SimpleGaugeProps> = ({ value, valueMin, valueMax, color }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / valueMax) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;
  const [animationOffset, setAnimationOffset] = useState(circumference);

  const remainingCalories = Math.abs(valueMax - value);

  useEffect(() => {
    setAnimationOffset(circumference);
    const timeout = setTimeout(() => {
      setAnimationOffset(offset);
    }, 100); 

    return () => clearTimeout(timeout);
  }, [value, offset, circumference]);

  return (
    <svg width={200} height={200} viewBox="0 0 200 200">
      <circle
        cx={100}
        cy={100}
        r={radius}
        fill="transparent"
        stroke="#d6d6d6"
        strokeWidth={13}
      />
      <circle
        cx={100}
        cy={100}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={15}
        strokeDasharray={circumference}
        strokeDashoffset={animationOffset}
        style={{
          transition: 'stroke-dashoffset 2s ease-out',
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
      <text x="50%" y="45%" textAnchor="middle" dy=".3em" fontSize="20px" fill="#333">
        {remainingCalories} / {valueMax}
      </text>
      <text x="51%" y="62%" textAnchor="middle" fontSize="14px" fill="#333" className=''>
        {value > valueMax ? "exceeding" : "remaining"}
      </text>
    </svg>
  );
};

export default SimpleGauge;