"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IProject } from '@/lib/models/Project';
import { Button } from '../ui/Button';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: IProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, slug, category, location, shortDescription, featuredImage } = project;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col bg-soft-white border border-light-accent overflow-hidden transition-luxury"
    >
      {/* Image container with slow zoom effect */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-off-white">
        <Image
          src={featuredImage.url}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-deep-black/10 group-hover:bg-deep-black/20 transition-colors duration-500" />
      </div>

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary-accent">
            {category}
          </span>
          <span className="text-[10px] uppercase tracking-[0.1em] text-charcoal/60">
            {location}
          </span>
        </div>

        <h3 className="font-serif text-xl md:text-2xl font-light text-deep-black tracking-wide mb-3 group-hover:text-primary-accent transition-colors duration-300 line-clamp-1">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-charcoal/60 font-light leading-relaxed mb-6 line-clamp-2">
          {shortDescription}
        </p>

        <div className="mt-auto">
          <Link href={`/projects/${slug}`} className="inline-block w-full">
            <Button
              variant="text"
              className="w-full flex items-center justify-between py-2 border-b border-light-accent text-deep-black group-hover:border-primary-accent"
            >
              <span>View Project</span>
              <ArrowUpRight className="h-4 w-4 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-primary-accent" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
