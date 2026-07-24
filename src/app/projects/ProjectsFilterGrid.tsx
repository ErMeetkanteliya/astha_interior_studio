'use client';

import React, { useState, useMemo } from 'react';
import { IProject } from '@/lib/models/Project';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ProjectsFilterGridProps {
  initialProjects: IProject[];
}

const CATEGORIES = [
  'All',
  'Residential',
  'Commercial',
  'Office',
  'Villa',
  'Apartment',
  'Restaurant',
  'Hotel',
  'Renovation',
  'Custom',
];

export function ProjectsFilterGrid({ initialProjects }: ProjectsFilterGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Client-side filtering logic
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || project.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialProjects, searchQuery, activeCategory]);

  return (
    <div className="w-full flex flex-col gap-12">
      
      {/* Filtering Actions Panel */}
      <div className="flex flex-col gap-8 border-b border-light-accent pb-8">
        
        {/* Category Selection Carousel/Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'text-[10px] sm:text-xs font-semibold tracking-widest uppercase px-4 py-2 border select-none transition-luxury cursor-pointer',
                activeCategory === cat
                  ? 'bg-deep-black text-soft-white border-deep-black'
                  : 'bg-transparent text-charcoal/60 border-light-accent hover:text-deep-black hover:border-charcoal'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input bar */}
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Search projects by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 font-sans font-light"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 stroke-[1.5] text-charcoal/40" />
        </div>
      </div>

      {/* Grid Display */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-24 bg-off-white border border-light-accent/30 text-charcoal/45 font-light tracking-wide text-sm">
          No projects match your search criteria. Add published projects in the Admin Panel.
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                key={project.slug}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
