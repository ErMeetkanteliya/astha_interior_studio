'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — Lenis-powered buttery smooth scrolling provider.
 * Synced with GSAP ScrollTrigger for seamless scroll-driven animations.
 * Automatically disables when prefers-reduced-motion is enabled.
 * Only used on public pages (not admin).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Add lenis class to html for CSS overrides
    document.documentElement.classList.add('lenis');

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Store the raf callback for proper cleanup
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // Handle route changes — refresh ScrollTrigger
    const handleRouteChange = () => {
      setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 100);
    };

    // Listen for Next.js route changes via popstate
    window.addEventListener('popstate', handleRouteChange);

    // Resize observer for content changes (debounced)
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 200);
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
      gsap.ticker.remove(rafCallback);
      document.documentElement.classList.remove('lenis');
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
