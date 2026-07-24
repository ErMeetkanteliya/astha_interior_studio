import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Project, { IProject } from '@/lib/models/Project';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ImageGallery } from '@/components/shared/ImageGallery';
import { PageTransition } from '@/components/shared/PageTransition';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { ArrowLeft, ArrowRight, ChevronRight, Calendar, MapPin, Layers, User, Expand } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let currentProject = null as IProject | null;
  let prevProject = null as { title: string; slug: string } | null;
  let nextProject = null as { title: string; slug: string } | null;
  let relatedProjects = [] as IProject[];

  try {
    await connectDB();
    
    // Find current project
    const projectDoc = await Project.findOne({ slug, status: 'Published' }).lean();
    if (!projectDoc) {
      notFound();
    }
    currentProject = JSON.parse(JSON.stringify(projectDoc));

    // Find all published projects to resolve prev/next
    const allPublished = await Project.find({ status: 'Published' })
      .sort({ completedDate: -1 })
      .select('slug title')
      .lean();
    
    const currentIndex = allPublished.findIndex((p) => p.slug === slug);
    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        nextProject = JSON.parse(JSON.stringify(allPublished[currentIndex - 1]));
      }
      if (currentIndex < allPublished.length - 1) {
        prevProject = JSON.parse(JSON.stringify(allPublished[currentIndex + 1]));
      }
    }

    // Find up to 3 related projects in the same category, excluding the current one
    const relatedDocs = await Project.find({
      status: 'Published',
      category: currentProject!.category,
      slug: { $ne: slug },
    })
      .limit(3)
      .lean();
    
    relatedProjects = JSON.parse(JSON.stringify(relatedDocs));
  } catch (err) {
    console.error('Failed to load project details:', err);
    notFound();
  }

  const {
    title,
    category,
    location,
    shortDescription,
    fullDescription,
    featuredImage,
    galleryImages,
    servicesUsed,
    completedDate,
    clientName,
    area,
  } = currentProject!;

  return (
    <PageTransition>
      {/* BREADCRUMB NAVIGATION */}
      <section className="bg-off-white py-4 border-b border-light-accent/15">
        <Container className="flex items-center gap-2 text-[10px] sm:text-xs font-sans tracking-widest text-charcoal/50 uppercase">
          <Link href="/" className="hover:text-primary-accent transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 stroke-[1.5] text-charcoal/30" />
          <Link href="/projects" className="hover:text-primary-accent transition-colors">Projects</Link>
          <ChevronRight className="h-3.5 w-3.5 stroke-[1.5] text-charcoal/30" />
          <span className="text-deep-black font-semibold line-clamp-1">{title}</span>
        </Container>
      </section>

      {/* LARGE HERO IMAGE */}
      <section className="relative h-[65vh] min-h-[400px] w-full bg-charcoal">
        <Image
          src={featuredImage.url}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-deep-black/35" />
      </section>

      {/* CONTENT DETAILS GRID */}
      <section className="py-16 sm:py-24 bg-soft-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: General Overview text */}
            <div className="lg:col-span-8 flex flex-col items-start">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-3 block">
                {category}
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-light text-deep-black tracking-wide leading-tight mb-6">
                {title}
              </h1>
              <div className="w-12 h-[1px] bg-primary-accent mb-8" />
              
              <h3 className="font-sans text-sm sm:text-base font-semibold tracking-wide text-charcoal mb-4">
                {shortDescription}
              </h3>
              
              <div className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light space-y-6 whitespace-pre-line">
                {fullDescription}
              </div>

              {/* Services Tags */}
              <div className="mt-10 pt-8 border-t border-light-accent/50 w-full">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-deep-black mb-4">
                  Services Delivered
                </h4>
                <div className="flex flex-wrap gap-2">
                  {servicesUsed.map((service, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider text-charcoal/70 bg-off-white border border-light-accent/40 px-3.5 py-1.5 uppercase"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Technical Stats Panel */}
            <div className="lg:col-span-4">
              <div className="bg-off-white border border-light-accent/50 p-8 sm:p-10 flex flex-col gap-6">
                <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide pb-4 border-b border-light-accent">
                  Project Details
                </h3>
                
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 stroke-[1.5] text-primary-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-charcoal/40 font-semibold mb-0.5">Location</span>
                    <span className="text-xs sm:text-sm text-deep-black font-light">{location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="h-5 w-5 stroke-[1.5] text-primary-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-charcoal/40 font-semibold mb-0.5">Completed Date</span>
                    <span className="text-xs sm:text-sm text-deep-black font-light">{formatDate(completedDate)}</span>
                  </div>
                </div>

                {clientName && (
                  <div className="flex items-start gap-4">
                    <User className="h-5 w-5 stroke-[1.5] text-primary-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-charcoal/40 font-semibold mb-0.5">Client</span>
                      <span className="text-xs sm:text-sm text-deep-black font-light">{clientName}</span>
                    </div>
                  </div>
                )}

                {area && (
                  <div className="flex items-start gap-4">
                    <Expand className="h-5 w-5 stroke-[1.5] text-primary-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-charcoal/40 font-semibold mb-0.5">Project Size</span>
                      <span className="text-xs sm:text-sm text-deep-black font-light">{area}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* PROJECT GALLERY */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-16 sm:py-20 bg-off-white border-y border-light-accent/15">
          <Container>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-deep-black tracking-wide mb-10 text-center">
              Image Gallery
            </h3>
            <ImageGallery images={galleryImages} />
          </Container>
        </section>
      )}

      {/* SIBLING PROJECTS NAVIGATION */}
      <section className="py-8 bg-charcoal border-b border-light-accent/10">
        <Container className="flex items-center justify-between gap-4">
          <div>
            {prevProject && (
              <Link href={`/projects/${prevProject.slug}`} className="group flex items-center gap-3 text-left">
                <ArrowLeft className="h-4.5 w-4.5 stroke-[1.5] text-primary-accent transition-transform duration-300 group-hover:-translate-x-1" />
                <div className="hidden sm:block">
                  <span className="block text-[8px] uppercase tracking-[0.2em] text-soft-white/40">Previous</span>
                  <span className="text-[11px] font-sans text-soft-white/80 group-hover:text-primary-accent transition-colors duration-300">{prevProject.title}</span>
                </div>
              </Link>
            )}
          </div>
          
          <Link href="/projects">
            <Button variant="secondary" size="sm" className="border-soft-white/20 hover:bg-soft-white hover:text-deep-black text-soft-white">
              Back To Works
            </Button>
          </Link>

          <div>
            {nextProject && (
              <Link href={`/projects/${nextProject.slug}`} className="group flex items-center gap-3 text-right">
                <div className="hidden sm:block">
                  <span className="block text-[8px] uppercase tracking-[0.2em] text-soft-white/40">Next</span>
                  <span className="text-[11px] font-sans text-soft-white/80 group-hover:text-primary-accent transition-colors duration-300">{nextProject.title}</span>
                </div>
                <ArrowRight className="h-4.5 w-4.5 stroke-[1.5] text-primary-accent transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </Container>
      </section>

      {/* RELATED PROJECTS */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-soft-white">
          <Container>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-deep-black tracking-wide mb-12 text-left">
              Related Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </PageTransition>
  );
}
