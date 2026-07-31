'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Reduced Motion Helper ─────────────────────────────────────────────────────
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── Mobile Detection Helper ────────────────────────────────────────────────────
function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

// ─── useScrollReveal ────────────────────────────────────────────────────────────
// Fade + translateY + blur removal for sections and blocks.
// Triggers once. GPU-accelerated. Respects reduced motion.
export function useScrollReveal(
  options: {
    y?: number;
    blur?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const el = ref.current;
    const mobile = isMobile();
    const {
      y = mobile ? 25 : 40,
      blur = mobile ? 3 : 6,
      duration = 1,
      delay = 0,
      ease = 'power4.out',
      start = 'top 88%',
    } = options;

    gsap.set(el, {
      opacity: 0,
      y,
      filter: `blur(${blur}px)`,
      willChange: 'transform, opacity, filter',
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          ease,
          clearProps: 'willChange',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [options]);

  return ref;
}

// ─── useStagger ─────────────────────────────────────────────────────────────────
// Stagger children reveal. Use on a container element.
export function useStagger(
  options: {
    y?: number;
    blur?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
    start?: string;
    childSelector?: string;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const container = ref.current;
    const mobile = isMobile();
    const {
      y = mobile ? 20 : 35,
      blur = mobile ? 2 : 5,
      duration = 0.9,
      stagger = 0.12,
      ease = 'power4.out',
      start = 'top 85%',
      childSelector = ':scope > *',
    } = options;

    const children = container.querySelectorAll(childSelector);
    if (children.length === 0) return;

    gsap.set(children, {
      opacity: 0,
      y,
      filter: `blur(${blur}px)`,
      willChange: 'transform, opacity, filter',
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start,
      once: true,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration,
          stagger,
          ease,
          clearProps: 'willChange',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [options]);

  return ref;
}

// ─── useParallax ────────────────────────────────────────────────────────────────
// Subtle parallax translateY on scroll. Disable/reduce on mobile.
export function useParallax(
  options: {
    speed?: number;
    start?: string;
    end?: string;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const el = ref.current;
    const mobile = isMobile();

    // Reduce parallax intensity on mobile
    const { speed = mobile ? 8 : 15, start = 'top bottom', end = 'bottom top' } = options;

    gsap.set(el, { willChange: 'transform' });

    const tween = gsap.fromTo(
      el,
      { y: -speed },
      {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: 'willChange' });
    };
  }, [options]);

  return ref;
}

// ─── useImageReveal ─────────────────────────────────────────────────────────────
// Subtle scale + opacity reveal for images.
export function useImageReveal(
  options: {
    scale?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const el = ref.current;
    const {
      scale = 1.04,
      duration = 1.2,
      delay = 0,
      ease = 'power3.out',
      start = 'top 88%',
    } = options;

    gsap.set(el, {
      opacity: 0,
      scale,
      willChange: 'transform, opacity',
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration,
          delay,
          ease,
          clearProps: 'willChange',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [options]);

  return ref;
}

// ─── ScrollTrigger Refresh Utility ──────────────────────────────────────────────
// Call this after dynamic content loads (e.g. images, CMS data)
export function refreshScrollTrigger(delay = 200) {
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, delay);
}

// ─── ScrollAnimationProvider ────────────────────────────────────────────────────
// A client component that initializes GSAP defaults and cleans up on route changes.
export function ScrollAnimationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set global GSAP defaults for performance
    gsap.defaults({
      ease: 'power4.out',
      duration: 1,
    });

    // Refresh ScrollTrigger after initial load and images
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', handleLoad);

    // Refresh on resize (debounced)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      // Kill all ScrollTriggers on unmount to prevent memory leaks
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
