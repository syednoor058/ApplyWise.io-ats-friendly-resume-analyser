"use client";

import React from "react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import type { PrimaryButtonProps } from "./PrimaryButton";
import type { SecondaryButtonProps } from "./SecondaryButton";

export interface SectionHeaderProps {
  /** The section heading */
  title1: string;
  title2?: string;
  /** Supporting paragraph text */
  paragraph: string;
  /** Square image URL placed inside the title */
  imageSrc?: string;
  /** Alt text for the image */
  imageAlt?: string;
  /** Configuration for the primary CTA button */
  primaryButton?: Omit<PrimaryButtonProps, "size">;
  /** Configuration for the secondary outline button */
  secondaryButton?: Omit<SecondaryButtonProps, "size">;
}

export default function SectionHeader({
  title1,
  title2,
  paragraph,
  imageSrc,
  primaryButton,
  secondaryButton,
}: SectionHeaderProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-16">
      {/* ── Left column — paragraph (desktop) ── */}
      <div className="order-2 md:order-1">
        <p className="text-base sm:text-xl text-slate-300 max-w-xl hidden md:block">
          {paragraph}
        </p>
      </div>

      {/* ── Right column — title + image + buttons (desktop) ── */}
      <div className="order-1 md:order-2 flex flex-col gap-6">
        {/* Title with optional inline square image */}
        <h2 className="text-[50px] lg:text-[75px] font-medium tracking-tight leading-none text-white flex flex-wrap items-center">
          {title1} 
          <span className="inline-block w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-lg overflow-hidden mx-3">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${imageSrc}')` }}
            />
          </span> {title2}
        </h2>

        {/* Paragraph for mobile — shown below title on small screens */}
        <p className="text-base sm:text-lg text-slate-300 md:hidden">
          {paragraph}
        </p>

        {/* Action buttons */}
        {(primaryButton || secondaryButton) && (
          <div className="flex flex-wrap items-center gap-4 mt-5">
            {primaryButton && <PrimaryButton size="lg" {...primaryButton} />}
            {secondaryButton && (
              <SecondaryButton size="lg" {...secondaryButton} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
