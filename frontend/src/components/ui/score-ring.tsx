'use client';

import React, { FC, useEffect, useRef, useState } from 'react';

interface ScoreRingProps {
  score: number;
  /** Diameter in pixels — defaults to 48 */
  size?: number;
  /** Stroke width — defaults to 4 */
  strokeWidth?: number;
  /** Whether to show the score number inside */
  showLabel?: boolean;
  /** Optional label text below the number (e.g. "/100") */
  sublabel?: string;
  /** Font size override for the number */
  fontSize?: number;
  /** Color of the fill ring. If not provided, auto-chosen based on score */
  color?: string;
}

function getDefaultColor(score: number): string {
  if (score >= 80) return '#10b981'; // emerald-500
  if (score >= 60) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
}

const ScoreRing: FC<ScoreRingProps> = ({
  score,
  size = 48,
  strokeWidth = 4,
  showLabel = true,
  fontSize,
  sublabel,
  color,
}) => {
  const half = size / 2;
  const r = half - strokeWidth;
  const circumference = 2 * Math.PI * r;

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fillColor = color ?? getDefaultColor(score);

  const computedFontSize = fontSize ?? Math.round(size * 0.32);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            /* ── Animate the score counter ── */
            const duration = 1000; // ms
            const steps = 30;
            const increment = score / steps;
            let current = 0;
            const interval = setInterval(() => {
              current += increment;
              if (current >= score) {
                setAnimatedScore(score);
                clearInterval(interval);
              } else {
                setAnimatedScore(Math.round(current));
              }
            }, duration / steps);

            /* ── Animate the ring fill ── */
            const targetProgress = (Math.min(Math.max(0, score), 100) / 100) * circumference;
            const stepIncrement = targetProgress / steps;
            let progress = 0;
            const ringInterval = setInterval(() => {
              progress += stepIncrement;
              if (progress >= targetProgress) {
                setAnimatedProgress(targetProgress);
                clearInterval(ringInterval);
              } else {
                setAnimatedProgress(progress);
              }
            }, duration / steps);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [score, circumference, hasAnimated]);

  return (
    <div ref={containerRef} className="inline-flex flex-col items-center gap-1 shrink-0">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0"
        aria-label={`Score: ${score} out of 100`}
      >
        {/* Glow filter */}
        <defs>
          <filter id={`ring-glow-${String(size)}-${fillColor.replace('#', '')}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${animatedProgress} ${circumference - animatedProgress}`}
          filter={`url(#ring-glow-${String(size)}-${fillColor.replace('#', '')})`}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />

        {/* Score number */}
        {showLabel && (
          <text
            x={half}
            y={half}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={computedFontSize}
            fontWeight={700}
            fill="white"
            fontFamily="inherit"
          >
            {animatedScore}
          </text>
        )}
      </svg>

      {/* Sublabel (e.g. "/100") */}
      {sublabel && (
        <span className="text-xs text-slate-400 font-medium">{sublabel}</span>
      )}
    </div>
  );
};

export default ScoreRing;