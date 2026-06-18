'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface PrimaryButtonProps {
  /** The destination URL */
  url?: string;
  /** The button label */
  buttonName?: string;
  /** Optional icon displayed before the label */
  icon?: React.ReactNode;
  /** Background color of the button (default: teal) */
  bgColor?: string;
  /** Color of the expanding circle on hover */
  hoverColor?: string;
  /** Text / icon color */
  textColor?: string;
  /** Text / icon color on hover */
  hoverTextColor?: string;
  /** Button size — sm, md (default), or lg */
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-2 gap-1.5 rounded-sm',
  md: 'text-sm px-5 py-2.5 gap-2 rounded-md',
  lg: 'text-base px-7 py-3.5 gap-2.5 rounded-lg',
};

export default function PrimaryButton({
  url = '#',
  buttonName = 'Button',
  icon,
  bgColor = '#14b8a6',
  hoverColor = '#ff579f',
  textColor = '#ffffff',
  hoverTextColor = '#ffffff',
  size = 'md',
}: PrimaryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  /* Large enough to cover the button from any position */
  const circleSize = 400;

  return (
    <Link
      href={url}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center overflow-hidden font-medium no-underline select-none transition-colors duration-500 ease-in-out ${sizeClasses[size]}`}
      style={{
        backgroundColor: bgColor,
        color: isHovered ? hoverTextColor : textColor,
      }}
    >
      {/* Expanding circle – rises from bottom-center */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          backgroundColor: hoverColor,
          width: circleSize,
          height: circleSize,
          left: '50%',
          bottom: 0,
          transform: `translate(-50%, 50%) scale(${isHovered ? 1 : 0})`,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Content – sits above the circle */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {buttonName}
        {icon && <span className="inline-flex">{icon}</span>}
      </span>
    </Link>
  );
}