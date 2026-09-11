import React from 'react';
import { LifeCategory, CATEGORY_CONFIG } from '../types';

interface RingMeterProps {
  category: LifeCategory;
  value: number; // Raw points
  max?: number; // Capacity
  size?: number; // default ~64px
  strokeWidth?: number; // default ~6px
}

export const RingMeter: React.FC<RingMeterProps> = ({
  category,
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
}) => {
  const config = CATEGORY_CONFIG[category];
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Calculate percentage for drawing the ring
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E7E2"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center raw points value in Newsreader serif */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-newsreader text-base font-semibold tracking-tight text-[#1E2A28]">
            {Math.round(value)}
          </span>
        </div>
      </div>

      {/* Category Label */}
      <span className="mt-2 text-xs font-medium text-[#5C6B67] tracking-tight truncate max-w-full text-center">
        {category}
      </span>
    </div>
  );
};
