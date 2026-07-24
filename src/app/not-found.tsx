'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center py-20 sm:py-32 bg-soft-white text-center">
      <Container className="flex flex-col items-center">
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary-accent mb-4">
          Error 404
        </span>
        <h1 className="font-serif text-5xl sm:text-7xl font-light text-deep-black tracking-wide mb-6">
          Page Not Found
        </h1>
        <div className="w-12 h-[1px] bg-primary-accent mb-8" />
        <p className="text-sm sm:text-base text-charcoal/60 font-light leading-relaxed max-w-md mx-auto mb-10">
          The luxury space you are seeking does not exist or has been moved. Explore our premium projects or return home.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            Return Home
          </Button>
        </Link>
      </Container>
    </div>
  );
}
