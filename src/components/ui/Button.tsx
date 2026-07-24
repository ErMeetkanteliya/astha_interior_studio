import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles: uppercase luxury look, letter spacing, transition curves
          'inline-flex items-center justify-center font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 ease-out focus:outline-none cursor-pointer',
          
          // Variants
          variant === 'primary' && 'bg-primary-accent text-deep-black hover:bg-deep-black hover:text-soft-white border border-transparent active:scale-[0.98]',
          variant === 'secondary' && 'bg-transparent text-deep-black border border-deep-black hover:bg-deep-black hover:text-soft-white active:scale-[0.98]',
          variant === 'dark' && 'bg-charcoal text-soft-white hover:bg-primary-accent hover:text-deep-black border border-transparent active:scale-[0.98]',
          variant === 'text' && 'bg-transparent text-deep-black hover:opacity-75 border-none p-0 tracking-[0.2em] relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-deep-black after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300',
          
          // Sizes
          size === 'sm' && 'px-4 py-2 text-[10px] tracking-[0.12em]',
          size === 'md' && 'px-6 py-3.5',
          size === 'lg' && 'px-8 py-4.5 text-[13px] tracking-[0.2em]',
          
          // States
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed active:scale-100',
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
