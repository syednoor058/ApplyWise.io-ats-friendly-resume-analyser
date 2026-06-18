import React, { FC } from 'react';

interface ScoreMeterProps {
  score: number;
  label?: string;
  size?: number;
  /** Optional summary text shown below the verdict */
  summary?: string;
}

function getScoreColor(score: number) {
  if (score >= 80) return { color: '#10b981', label: 'Strong', badgeCls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  if (score >= 60) return { color: '#f59e0b', label: 'Medium', badgeCls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
  return { color: '#ef4444', label: 'Low', badgeCls: 'bg-red-500/10 text-red-400 border-red-500/20' };
}

function getVerdict(score: number) {
  if (score >= 80) return { text: 'Strong Candidate', cls: 'text-emerald-400' };
  if (score >= 60) return { text: 'Moderate Fit', cls: 'text-amber-400' };
  return { text: 'Needs Improvement', cls: 'text-red-400' };
}

const ScoreMeter: FC<ScoreMeterProps> = ({ score, label = 'OVERALL SCORE', size = 200, summary }) => {
  const strokeWidth = 12;
  const half = size / 2;
  const r = half - strokeWidth;
  const circumference = 2 * Math.PI * r;
  const filled = Math.min(Math.max(0, score), 100) / 100 * circumference;
  const { color, label: matchLabel, badgeCls } = getScoreColor(score);
  const verdict = getVerdict(score);
  const scoreFontSize = Math.round(size * 0.26);
  const subFontSize = Math.round(size * 0.07);

  return (
    <div className="flex flex-col items-center">
      {/* Circular ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label={`${label}: ${score} out of 100`}
        >
          {/* Glow filter */}
          <defs>
            <filter id="meter-glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={half}
            cy={half}
            r={r}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />

          {/* Progress ring */}
          <circle
            cx={half}
            cy={half}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            strokeDashoffset={100 - score}
            filter="url(#meter-glow)"
            style={{
              transition: 'stroke-dasharray 1s ease-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />

          {/* Score number */}
          <text
            x={half}
            y={half - subFontSize * 0.4}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={scoreFontSize}
            fontWeight={800}
            fill="white"
            fontFamily="inherit"
          >
            {score}
          </text>

          {/* /100 sub-label */}
          <text
            x={half}
            y={half + scoreFontSize * 0.45}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={subFontSize}
            fill="#64748b"
            fontFamily="inherit"
          >
            out of 100
          </text>
        </svg>
      </div>

      {/* Match badge */}
      <span className={`mt-3 text-xs font-bold px-3 py-1 rounded-full border ${badgeCls}`}>
        {matchLabel} Match
      </span>

      {/* Verdict */}
      <p className={`mt-2 text-lg font-extrabold ${verdict.cls}`}>
        {verdict.text}
      </p>

      {/* Optional summary */}
      {summary && (
        <p className="text-sm text-slate-500 mt-1.5 text-center">
          {summary}...
        </p>
      )}

      {/* Optional label */}
      {label && <p className="mt-1 text-xs text-slate-500 uppercase tracking-wider">{label}</p>}
    </div>
  );
};

export default ScoreMeter;
