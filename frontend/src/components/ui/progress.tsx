import React, { FC } from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
  showText?: boolean;
}

const Progress: FC<ProgressProps> = ({
  value,
  max = 100,
  className = '',
  indicatorClassName = '',
  showText = false,
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  // Determine indicator color based on value if not explicitly custom
  let colorClass = 'bg-teal-500 shadow-teal-500/20';
  if (!indicatorClassName) {
    if (percentage < 50) {
      colorClass = 'bg-red-500 shadow-red-500/20';
    } else if (percentage < 75) {
      colorClass = 'bg-amber-500 shadow-amber-500/20';
    } else {
      colorClass = 'bg-emerald-500 shadow-emerald-500/20';
    }
  }

  return (
    <div className="w-full flex items-center space-x-2">
      <div className={`relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden ${className}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out shadow-sm ${indicatorClassName || colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <span className="text-sm font-semibold min-w-8 text-right text-slate-300">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export default Progress;
