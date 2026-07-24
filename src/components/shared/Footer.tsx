import React from 'react';
import Link from 'next/link';
import { IStudioInfo } from '@/lib/models/StudioInfo';

// Custom SVG Brand Icons to match Lucide outline stroke design
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function PinterestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 22c-.19 0-.37-.06-.53-.18-.28-.21-.36-.6-.18-.91l2.5-4.33C9.17 15.54 8.7 13.84 8.7 12c0-4.58 3.72-8.3 8.3-8.3s8.3 3.72 8.3 8.3c0 4.58-3.72 8.3-8.3 8.3-1.6 0-3.14-.46-4.47-1.33l-3.8 6.58c-.14.24-.39.38-.67.38z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface FooterProps {
  studioInfo: Partial<IStudioInfo>;
}

export function Footer({ studioInfo }: FooterProps) {
  const {
    companyName = 'ASTHA',
    phone = '+91 98765 43210',
    email = 'info@asthainterior.com',
    address = 'Luxury Heights, Suite 404, Ahmedabad, Gujarat, India',
    instagram,
    facebook,
    pinterest,
    linkedin,
    footerCopyright = '© 2026 ASTHA Interior Studio. All rights reserved.',
  } = studioInfo;

  return (
    <footer className="bg-charcoal text-soft-white/80 font-sans text-xs tracking-wider border-t border-light-accent/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-16 mb-16 md:mb-20">
          
          {/* Column 1: Logo and Brand statement */}
          <div className="md:col-span-5 flex flex-col items-start">
            <span className="font-serif text-2xl tracking-[0.2em] font-light text-soft-white uppercase mb-2">
              {companyName}
            </span>
            <span className="font-sans text-[7px] tracking-[0.45em] font-semibold text-soft-white/40 uppercase mb-6">
              Interior Studio
            </span>
            <p className="text-soft-white/50 leading-relaxed font-light mb-8 max-w-sm">
              We shape luxury spaces that synthesize elegance, minimalism, and premium comfort. Our studio designs client-focused residential and commercial realities.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-6">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-soft-white/40 hover:text-primary-accent transition-colors"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-soft-white/40 hover:text-primary-accent transition-colors"
                  aria-label="Facebook Page"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {pinterest && (
                <a
                  href={pinterest}
                  target="_blank"
                  rel="noreferrer"
                  className="text-soft-white/40 hover:text-primary-accent transition-colors"
                  aria-label="Pinterest Board"
                >
                  <PinterestIcon className="h-4 w-4" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-soft-white/40 hover:text-primary-accent transition-colors"
                  aria-label="LinkedIn Company Profile"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation links */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-soft-white mb-6">
              Explore
            </h4>
            <ul className="flex flex-col gap-4 font-light text-soft-white/50">
              <li>
                <Link href="/" className="hover:text-primary-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary-accent transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary-accent transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-soft-white mb-6">
              Studio
            </h4>
            <div className="flex flex-col gap-4 text-soft-white/50 font-light leading-relaxed">
              <p>
                <span className="block text-soft-white/30 text-[9px] uppercase tracking-widest font-semibold mb-1">
                  Location
                </span>
                {address}
              </p>
              <p>
                <span className="block text-soft-white/30 text-[9px] uppercase tracking-widest font-semibold mb-1">
                  Inquiries
                </span>
                <a href={`mailto:${email}`} className="hover:text-primary-accent transition-colors">
                  {email}
                </a>
              </p>
              <p>
                <span className="block text-soft-white/30 text-[9px] uppercase tracking-widest font-semibold mb-1">
                  Call Us
                </span>
                <a href={`tel:${phone}`} className="hover:text-primary-accent transition-colors">
                  {phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom line: Copyright & Hidden Link */}
        <div className="border-t border-light-accent/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-soft-white/30 text-[10px] tracking-widest font-light">
          <p>{footerCopyright}</p>
          
          {/* Very small, low opacity text link for admin access */}
          <Link
            href="/admin/login"
            className="hover:text-primary-accent/80 transition-colors opacity-40 hover:opacity-100 uppercase text-[9px] select-none"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}
