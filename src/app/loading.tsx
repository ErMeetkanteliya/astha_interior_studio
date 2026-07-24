'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-soft-white">
      <div className="flex flex-col items-center select-none">
        <span className="font-serif text-3xl tracking-[0.25em] font-light text-deep-black uppercase animate-pulse">
          ASTHA
        </span>
        <span className="font-sans text-[8px] tracking-[0.45em] font-semibold text-charcoal/40 uppercase -mt-0.5 animate-pulse">
          Interior Studio
        </span>
        <div className="w-16 h-[1px] bg-primary-accent/30 mt-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-full bg-primary-accent animate-[loading-bar_1.5s_infinite_ease-in-out]" />
        </div>
      </div>
      
      {/* Keyframe animation injected inline */}
      <style jsx global>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
