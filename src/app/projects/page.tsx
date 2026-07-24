import React from 'react';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import { Container } from '@/components/ui/Container';
import { PageTransition } from '@/components/shared/PageTransition';
import { ProjectsFilterGrid } from './ProjectsFilterGrid';

// Disable page static caching to fetch updated projects dynamically
export const revalidate = 0;

export default async function ProjectsPage() {
  let projectsList = [] as any[];

  try {
    await connectDB();
    const projects = await Project.find({ status: 'Published' })
      .sort({ completedDate: -1 })
      .lean();
    
    projectsList = JSON.parse(JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to load published projects for grid:', err);
  }

  return (
    <PageTransition>
      {/* Header Banner */}
      <section className="py-20 sm:py-28 bg-off-white border-b border-light-accent/15">
        <Container>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-4 block text-center">
            SELECTED PORTFOLIO
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-deep-black tracking-wide text-center max-w-4xl mx-auto leading-tight">
            Our Luxury Works
          </h1>
          <div className="w-16 h-[1px] bg-primary-accent mx-auto mt-6" />
        </Container>
      </section>

      {/* Grid Grid */}
      <section className="py-20 sm:py-28 bg-soft-white">
        <Container>
          <ProjectsFilterGrid initialProjects={projectsList} />
        </Container>
      </section>
    </PageTransition>
  );
}
