'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  companyName?: string;
  logoUrl?: string;
}

export function Navbar({ companyName = 'ASTHA', logoUrl }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
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
    { name: 'Gallery', href: '/gallery' },
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
            : 'bg-transparent py-6 border-b border-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="group flex flex-col justify-center select-none">
            <span className="font-serif text-2xl tracking-[0.15em] font-light text-deep-black uppercase group-hover:text-primary-accent transition-colors duration-300">
              {companyName}
            </span>
            <span className="font-sans text-[7px] tracking-[0.4em] font-semibold text-charcoal/50 uppercase -mt-0.5 group-hover:text-primary-accent/70 transition-colors duration-300">
              Interior Studio
            </span>
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
