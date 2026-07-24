import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'flex flex-col mb-12 sm:mb-16 md:mb-20',
        align === 'center' && 'items-center text-center',
        align === 'left' && 'items-start text-left',
        align === 'right' && 'items-end text-right',
        className
      )}
    >
      {subtitle && (
        <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-3 block">
          {subtitle}
        </span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-deep-black leading-tight tracking-wide">
        {title}
      </h2>
      <div className="w-16 h-[1px] bg-primary-accent mt-6" />
    </div>
  );
}
