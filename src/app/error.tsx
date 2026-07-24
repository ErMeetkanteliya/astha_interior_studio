'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js Application Error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-20 sm:py-32 bg-soft-white text-center">
      <Container className="flex flex-col items-center">
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-red-500 mb-4">
          Application Error
        </span>
        <h1 className="font-serif text-5xl sm:text-7xl font-light text-deep-black tracking-wide mb-6">
          Something went wrong
        </h1>
        <div className="w-12 h-[1px] bg-red-500 mb-8" />
        <p className="text-sm sm:text-base text-charcoal/60 font-light leading-relaxed max-w-md mx-auto mb-10">
          An unexpected error occurred while rendering this luxury space. Let us try to restore the experience.
        </p>
        <div className="flex items-center gap-4">
          <Button variant="primary" size="lg" onClick={() => reset()}>
            Try Again
          </Button>
          <Button variant="secondary" size="lg" onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
