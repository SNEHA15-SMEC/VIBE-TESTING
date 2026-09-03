import React, { useId } from 'react';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  isPositive,
  className = 'w-full h-14'
}) => {
  const gradientId = useId();

  if (!data || data.length < 2) {
    return null;
  }

  const width = 240;
  const height = 60;
  const padding = 6;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Compute coordinates
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    // Invert y because SVG y goes down
    const normalized = (val - min) / range;
    // When isPositive is true, we want higher values to look high (lower y)
    const y = height - padding - normalized * (height - 2 * padding);
    return { x, y };
  });

  // Build a smooth cubic bezier SVG path
  let pathD = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    pathD += ` C ${controlX},${current.y} ${controlX},${next.y} ${next.x},${next.y}`;
  }

  const fillD = `${pathD} L ${width},${height} L 0,${height} Z`;

  const color = isPositive ? '#089981' : '#F23645';

  return (
    <div className={className}>
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <path d={fillD} fill={`url(#${gradientId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
