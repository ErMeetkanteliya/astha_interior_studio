'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Reduced Motion Helper ─────────────────────────────────────────────────────
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

// ─── PageTransition ─────────────────────────────────────────────────────────────
// Framer Motion page entrance/exit with subtle blur.
interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col w-full"
    >
      {children}
    </motion.div>
  );
}

// ─── RevealOnScroll ─────────────────────────────────────────────────────────────
// GSAP ScrollTrigger-powered reveal with fade + translateY + blur removal.
// Keeps the exact same API (children, delay, direction) so NO page files need changes.
interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function RevealOnScroll({ children, delay = 0, direction = 'up' }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const reduced = prefersReducedMotion();
    const mobile = isMobile();

    // If reduced motion, just show immediately
    if (reduced) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' });
      return;
    }

    // Direction offsets (reduced on mobile)
    const distance = mobile ? 20 : 35;
    const directionMap: Record<string, { x?: number; y?: number }> = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
      none: {},
    };

    const offset = directionMap[direction] || {};
    const blurAmount = mobile ? 3 : 6;

    gsap.set(el, {
      opacity: 0,
      ...offset,
      filter: `blur(${blurAmount}px)`,
      willChange: 'transform, opacity, filter',
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          delay,
          ease: 'power4.out',
          onComplete: () => {
            gsap.set(el, { clearProps: 'willChange,filter,transform' });
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [delay, direction]);

  return <div ref={ref}>{children}</div>;
}
