'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { ButtonSize } from './PrimaryButton';

export interface SecondaryButtonProps {
  /** The button label */
  buttonName?: string;
  /** The destination URL */
  url?: string;
  /** Border, text, and expanding circle color (default: white) */
  color?: string;
  /** Optional icon displayed before the label */
  icon?: React.ReactNode;
  /** Button size — sm, md (default), or lg */
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-2 gap-1.5 rounded-sm',
  md: 'text-sm px-5 py-2.5 gap-2 rounded-md',
  lg: 'text-base px-7 py-3.5 gap-2.5 rounded-lg',
};

export default function SecondaryButton({
  buttonName = 'Button',
  url = '#',
  color = '#ffffff',
  icon,
  size = 'md',
}: SecondaryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  /* Large enough to cover the button from any position */
  const circleSize = 400;

  return (
    <Link
      href={url}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center overflow-hidden  font-medium no-underline select-none transition-colors duration-500 ease-in-out ${sizeClasses[size]}`}
      style={{
        border: `1.5px solid ${color}`,
        color,
      }}
    >
      {/* Expanding circle – rises from bottom-center */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          backgroundColor: color,
          width: circleSize,
          height: circleSize,
          left: '50%',
          bottom: 0,
          transform: `translate(-50%, 50%) scale(${isHovered ? 1 : 0})`,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Content – sits above the circle */}
      <span className="relative z-10 inline-flex items-center gap-2 text-white mix-blend-difference">
        {icon && <span className="inline-flex">{icon}</span>}
        {buttonName}
      </span>
    </Link>
  );
}