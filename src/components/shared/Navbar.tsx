'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from "next/image";

interface NavbarProps {
  companyName?: string;
}

export function Navbar({ companyName = 'ASTHA' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Scroll listener — glassmorphism + directional hide/show
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Glassmorphism state
        setIsScrolled(currentScrollY > 20);

        // Hide/show on scroll direction (only beyond 100px)
        if (currentScrollY > 100) {
          if (currentScrollY > lastScrollY.current + 5) {
            // Scrolling down — hide
            setIsHidden(true);
          } else if (currentScrollY < lastScrollY.current - 5) {
            // Scrolling up — show
            setIsHidden(false);
          }
        } else {
          // At the top — always show
          setIsHidden(false);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out',
          isScrolled
            ? 'glassmorphism py-4 shadow-sm'
            : 'bg-transparent py-1 border-b border-transparent'
        )}
        style={{
          transform: isHidden && !isMobileMenuOpen ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.5s ease-out, background-color 0.5s ease-out, box-shadow 0.5s ease-out',
        }}
      >
        <div className="mx-auto max-w-7xl h-fit px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className=" group flex items-center select-none">
              <Image
    src="/astha-logo-clean.png"
    alt="Astha Interior Studio"
   width={260}
  height={85}
  priority
  className="w-auto h-20 object-contain"
  />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'font-sans text-[10px] tracking-[0.2em] font-medium uppercase text-deep-black transition-colors duration-300 relative py-1 hover:text-primary-accent',
                  isLinkActive(link.href) && 'text-primary-accent'
                )}
              >
                {link.name}
                {isLinkActive(link.href) && (
                  <motion.div
                    layoutId="activeNavLinkLine"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Hamburger Menu Triggers */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-deep-black hover:text-primary-accent transition-colors p-1"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 stroke-[1.5]" />
              ) : (
                <Menu className="h-6 w-6 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-soft-white flex flex-col pt-24 px-6 sm:px-12 md:hidden"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.name}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'font-serif text-3xl font-light text-deep-black hover:text-primary-accent transition-colors duration-300 flex items-center justify-between border-b border-light-accent/30 pb-3',
                      isLinkActive(link.href) && 'text-primary-accent'
                    )}
                  >
                    <span>{link.name}</span>
                    <span className="font-sans text-[10px] tracking-wider text-charcoal/40 font-light">
                      0{idx + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Footer Info */}
            <div className="mt-auto mb-10 text-center font-sans text-[10px] tracking-widest text-charcoal/40 uppercase">
              {companyName} Interior Studio
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
