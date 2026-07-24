'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ICloudinaryImage } from '@/lib/models/Project';

interface ImageGalleryProps {
  images: ICloudinaryImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex! - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex! + 1));
    }
  };

  return (
    <div className="w-full">
      {/* Visual Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
        {images.map((img, idx) => (
          <div
            key={img.publicId || idx}
            onClick={() => setLightboxIndex(idx)}
            className="group relative aspect-[4/3] w-full overflow-hidden bg-off-white cursor-pointer border border-light-accent/30"
          >
            <Image
              src={img.url}
              alt={`Gallery Image ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[800ms] group-hover:scale-105"
            />
            {/* Elegant overlay on hover */}
            <div className="absolute inset-0 bg-deep-black/0 group-hover:bg-deep-black/30 transition-all duration-300 flex items-center justify-center">
              <span className="text-soft-white opacity-0 group-hover:opacity-100 font-sans text-[10px] uppercase tracking-[0.25em] transition-opacity duration-300 border border-soft-white/30 px-4 py-2 bg-deep-black/20 backdrop-blur-[2px]">
                View Image
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-black/95 backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 z-10 text-soft-white/60 hover:text-soft-white transition-colors cursor-pointer p-2"
              aria-label="Close viewer"
            >
              <X className="h-6 w-6 stroke-[1.5]" />
            </button>

            {/* Back Drop Trigger */}
            <div className="absolute inset-0" onClick={() => setLightboxIndex(null)} />

            {/* Viewer Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 sm:left-8 z-10 text-soft-white/60 hover:text-soft-white transition-colors cursor-pointer bg-deep-black/40 hover:bg-deep-black/60 p-3 rounded-full backdrop-blur-sm border border-soft-white/10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 sm:right-8 z-10 text-soft-white/60 hover:text-soft-white transition-colors cursor-pointer bg-deep-black/40 hover:bg-deep-black/60 p-3 rounded-full backdrop-blur-sm border border-soft-white/10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 stroke-[1.5]" />
                </button>
              </>
            )}

            {/* Centered Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[80vh] aspect-[4/3] w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex].url}
                alt={`Expanded image ${lightboxIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-soft-white/60 font-sans text-xs tracking-widest font-light">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
