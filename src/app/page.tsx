import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/db';
import StudioInfo from '@/lib/models/StudioInfo';
import Project from '@/lib/models/Project';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { PageTransition, RevealOnScroll } from '@/components/shared/PageTransition';
export const dynamic = "force-dynamic";

// Local luxury placeholder images
const DEFAULT_HERO_IMAGE = '/images/hero.jpg';
const DEFAULT_ABOUT_IMAGE = '/images/about.jpg';

export default async function HomePage() {
  let studioData = {} as any;
  let featuredProjects = [] as any[];

  try {
    await connectDB();
    const info = await StudioInfo.findOne().lean();
    if (info) {
      studioData = JSON.parse(JSON.stringify(info));
    }
    
    // Fetch top 3 published projects
    const projects = await Project.find({ status: 'Published' })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    
    featuredProjects = JSON.parse(JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to load data for home page:', err);
  }

  // Fallbacks
  const heroImage = studioData.heroImage?.url || DEFAULT_HERO_IMAGE;
  const heroTitle = studioData.heroTitle || 'Crafting Premium Spaces That Inspire';
  const heroSubtitle = studioData.heroSubtitle || 'Luxury Residential & Commercial Interior Design Studio based in India.';
  
  const aboutTitle = studioData.aboutTitle || 'Elevating Spaces, Redefining Luxury';
  const aboutSubtitle = studioData.aboutSubtitle || 'THE ART OF INTERIOR DESIGN';
  const aboutDescription = studioData.aboutDescription || 'We believe that exceptional design is a synthesis of form, function, and emotion. Our studio specializes in high-end, custom residential and commercial spaces that blend warm minimalism with premium comfort. Every project is curated to tell a unique story of refinement and sophistication.';
  const aboutImage = studioData.aboutImage?.url || DEFAULT_ABOUT_IMAGE;

  const stats = [
    { value: studioData.stat1Value || '150+', label: studioData.stat1Label || 'Projects Completed' },
    { value: studioData.stat2Value || '8+', label: studioData.stat2Label || 'Years Experience' },
    { value: studioData.stat3Value || '98%', label: studioData.stat3Label || 'Client Satisfaction' },
    { value: studioData.stat4Value || '24/7', label: studioData.stat4Label || 'Support' },
  ];

  return (
    <PageTransition>
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-charcoal">
        {/* Background Image with slow zoom animation */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Luxury Interior Hero"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75 animate-[hero-zoom_20s_infinite_ease-out-in]"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-deep-black/50 z-10" />
        </div>

        {/* Hero Content */}
        <Container className="relative z-20 flex flex-col items-center justify-center text-center mt-[-40px]">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-primary-accent mb-4 block animate-[fade-in_1s_ease-out]">
            Welcome to {studioData.companyName || 'ASTHA'}
          </span>
          
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-soft-white leading-tight tracking-wide max-w-4xl mb-6 select-none animate-[slide-up_1.2s_ease-out]">
            {heroTitle}
          </h1>
          
          <p className="text-sm sm:text-lg text-soft-white/80 font-light leading-relaxed max-w-2xl mx-auto mb-10 select-none animate-[slide-up_1.4s_ease-out]">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto animate-[slide-up_1.6s_ease-out]">
            <Link href="/projects" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Explore Projects
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto border-soft-white hover:bg-soft-white hover:text-deep-black text-soft-white"
              >
                Get In Touch
              </Button>
            </Link>
          </div>
        </Container>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 select-none pointer-events-none">
          <span className="text-[8px] uppercase tracking-[0.25em] text-soft-white/40">Scroll</span>
          <div className="w-[1px] h-12 bg-soft-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-primary-accent animate-[scroll-dot_1.8s_infinite_ease-in-out]" />
          </div>
        </div>
      </section>

      {/* LIGHT CONTENT SECTIONS CONTINUOUS PAPER CANVAS */}
      <div className="bg-paper-texture">
        {/* 2. ABOUT PREVIEW */}
        <section className="py-20 sm:py-28 bg-soft-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Image Box */}
            <div className="lg:col-span-6">
              <RevealOnScroll direction="left">
                <div className="relative aspect-[4/3] w-full overflow-hidden  bg-off-white">
                  <Image
                    src={aboutImage}
                    alt="About ASTHA"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </RevealOnScroll>
            </div>

            {/* Content Box */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <RevealOnScroll direction="up">
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-3 block">
                  {aboutSubtitle}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-deep-black tracking-wide leading-tight mb-6">
                  {aboutTitle}
                </h2>
                <div className="w-12 h-[1px] bg-primary-accent mb-8" />
                <p className="text-sm sm:text-base text-charcoal/70 font-light leading-relaxed mb-8">
                  {aboutDescription}
                </p>
                <Link href="/about">
                  <Button variant="secondary" size="md">
                    Our Philosophy
                  </Button>
                </Link>
              </RevealOnScroll>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-20 bg-off-white border-y border-light-accent/15">
        <Container>
          <RevealOnScroll>
            <SectionTitle title="The Luxury Standard" subtitle="WHY CHOOSE US" />
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RevealOnScroll delay={0.1}>
              <div className="p-8 bg-soft-white border border-light-accent/30 flex flex-col gap-4 text-center items-center">
                <div className="w-12 h-12 rounded-full bg-light-accent/20 flex items-center justify-center mb-2">
                  <span className="font-serif text-lg text-primary-accent font-medium">01</span>
                </div>
                <h3 className="font-serif text-xl font-medium tracking-wide">Bespoke Aesthetics</h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light">
                  Tailored designs matching your individual lifestyle and architectural heritage.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="p-8 bg-soft-white border border-light-accent/30 flex flex-col gap-4 text-center items-center">
                <div className="w-12 h-12 rounded-full bg-light-accent/20 flex items-center justify-center mb-2">
                  <span className="font-serif text-lg text-primary-accent font-medium">02</span>
                </div>
                <h3 className="font-serif text-xl font-medium tracking-wide">Exquisite Materials</h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light">
                  Uncompromised material sourcing, curated textures, and premium craftsmanship.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <div className="p-8 bg-soft-white border border-light-accent/30 flex flex-col gap-4 text-center items-center">
                <div className="w-12 h-12 rounded-full bg-light-accent/20 flex items-center justify-center mb-2">
                  <span className="font-serif text-lg text-primary-accent font-medium">03</span>
                </div>
                <h3 className="font-serif text-xl font-medium tracking-wide">Precise Handover</h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light">
                  Seamless end-to-end execution, strict project control, and premium final reveals.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="py-16 sm:py-20 bg-charcoal text-soft-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-soft-white/10 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-2 pt-6 md:pt-0">
                <span className="font-serif text-4xl sm:text-5xl font-light text-primary-accent">
                  {stat.value}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-soft-white/60 font-light mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. SERVICES */}
      <section className="py-20 sm:py-28 bg-soft-white">
        <Container>
          <RevealOnScroll>
            <SectionTitle title="Exquisite Design Services" subtitle="OUR EXPERTISE" />
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            <RevealOnScroll delay={0.1}>
              <div className="group border border-light-accent/40 bg-soft-white transition-luxury p-8 sm:p-10 flex flex-col items-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <span className="font-serif text-xs font-semibold tracking-widest text-primary-accent mb-4 block">01</span>
                <h3 className="font-serif text-2xl font-light text-deep-black tracking-wide mb-4">Residential Styling</h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light mb-6">
                  Curating penthouses, luxury villas, and custom private apartments that synthesize warmth and sophisticated comfort.
                </p>
                <div className="w-10 h-[1px] bg-primary-accent group-hover:w-20 transition-all duration-300" />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="group border border-light-accent/40 bg-soft-white transition-luxury p-8 sm:p-10 flex flex-col items-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <span className="font-serif text-xs font-semibold tracking-widest text-primary-accent mb-4 block">02</span>
                <h3 className="font-serif text-2xl font-light text-deep-black tracking-wide mb-4">Commercial Realities</h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light mb-6">
                  Premium retail showrooms, luxury workspace offices, and design-led corporate spaces that enhance brand presence.
                </p>
                <div className="w-10 h-[1px] bg-primary-accent group-hover:w-20 transition-all duration-300" />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <div className="group border border-light-accent/40 bg-soft-white transition-luxury p-8 sm:p-10 flex flex-col items-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <span className="font-serif text-xs font-semibold tracking-widest text-primary-accent mb-4 block">03</span>
                <h3 className="font-serif text-2xl font-light text-deep-black tracking-wide mb-4">Bespoke Furnishing</h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light mb-6">
                  Consultation and curation of custom furniture fittings, high-end materials sourcing, and lighting layouts.
                </p>
                <div className="w-10 h-[1px] bg-primary-accent group-hover:w-20 transition-all duration-300" />
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* 6. FEATURED PROJECTS */}
      <section className="py-20 bg-off-white border-y border-light-accent/15">
        <Container>
          <RevealOnScroll>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 sm:mb-16">
              <div className="text-left">
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-3 block">
                  SELECTED WORKS
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-deep-black tracking-wide leading-tight">
                  Featured Projects
                </h2>
              </div>
              <Link href="/projects" className="mt-4 sm:mt-0">
                <Button variant="secondary" size="md">
                  View All Works
                </Button>
              </Link>
            </div>
          </RevealOnScroll>

          {featuredProjects.length === 0 ? (
            <div className="text-center py-16 bg-soft-white border border-light-accent/30 text-charcoal/40 font-light text-sm tracking-wider">
              No featured projects found. Add published projects in the Admin Panel to display them here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project, idx) => (
                <RevealOnScroll key={project._id} delay={idx * 0.12}>
                  <ProjectCard project={project} />
                </RevealOnScroll>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 7. DESIGN PROCESS */}
      <section className="py-20 sm:py-28 bg-soft-white">
        <Container>
          <RevealOnScroll>
            <SectionTitle title="Our Design Process" subtitle="THE PATHWAY TO LUXURY" />
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <RevealOnScroll delay={0.1}>
              <div className="flex flex-col gap-4">
                <span className="font-serif text-3xl md:text-4xl text-primary-accent/40 font-light border-b border-light-accent/30 pb-4">
                  01
                </span>
                <h3 className="font-serif text-lg font-medium tracking-wide">Consultation</h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light">
                  Aligning on project vision, design style profile, spatial scope, and timelines.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="flex flex-col gap-4">
                <span className="font-serif text-3xl md:text-4xl text-primary-accent/40 font-light border-b border-light-accent/30 pb-4">
                  02
                </span>
                <h3 className="font-serif text-lg font-medium tracking-wide">Concept Planning</h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light">
                  Exquisite concept designs, structural floorplans, and texture boards mapping.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <div className="flex flex-col gap-4">
                <span className="font-serif text-3xl md:text-4xl text-primary-accent/40 font-light border-b border-light-accent/30 pb-4">
                  03
                </span>
                <h3 className="font-serif text-lg font-medium tracking-wide">Curation</h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light">
                  Procurement of bespoke elements, luxury lighting fixtures, and materials coordination.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.4}>
              <div className="flex flex-col gap-4">
                <span className="font-serif text-3xl md:text-4xl text-primary-accent/40 font-light border-b border-light-accent/30 pb-4">
                  04
                </span>
                <h3 className="font-serif text-lg font-medium tracking-wide">Handover</h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light">
                  Precise coordination, execution audit, and pristine custom space reveal.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 bg-off-white border-y border-light-accent/15 overflow-hidden">
        <Container>
          <RevealOnScroll>
            <SectionTitle title="Client Reflections" subtitle="TESTIMONIALS" />
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <RevealOnScroll delay={0.1}>
              <div className="bg-soft-white border border-light-accent/25 p-8 sm:p-10 flex flex-col gap-6 relative shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <span className="text-5xl font-serif text-primary-accent/20 absolute top-4 left-6 leading-none">“</span>
                <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed italic pt-4">
                  ASTHA transformed our penthouse into a serene, minimalist sanctuary. Their attention to material textures and light alignment is pure artistry.
                </p>
                <div className="flex flex-col border-t border-light-accent/30 pt-4 mt-2">
                  <span className="font-serif text-sm font-semibold tracking-wide text-deep-black">Vikram Shah</span>
                  <span className="text-[10px] tracking-widest text-charcoal/40 uppercase font-light">Penthouse Owner, Ahmedabad</span>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="bg-soft-white border border-light-accent/25 p-8 sm:p-10 flex flex-col gap-6 relative shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <span className="text-5xl font-serif text-primary-accent/20 absolute top-4 left-6 leading-none">“</span>
                <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed italic pt-4">
                  A masterclass in luxury commercial design. The office atmosphere they created balances warmth and elite professionalism perfectly.
                </p>
                <div className="flex flex-col border-t border-light-accent/30 pt-4 mt-2">
                  <span className="font-serif text-sm font-semibold tracking-wide text-deep-black">Aditi Rao</span>
                  <span className="text-[10px] tracking-widest text-charcoal/40 uppercase font-light">Founder, Elite Consultants</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="py-20 sm:py-28 bg-soft-white">
        <Container className="max-w-4xl">
          <RevealOnScroll>
            <SectionTitle title="Frequently Asked Inquiries" subtitle="FAQ" />
          </RevealOnScroll>

          <div className="flex flex-col gap-6">
            <RevealOnScroll delay={0.05}>
              <div className="border-b border-light-accent/40 pb-6">
                <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-3">
                  What is your design philosophy?
                </h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light">
                  We emphasize warm minimalism, pure natural textures, generous whitespace alignment, and functional elegance. Our designs center on authentic luxury that enhances comfort rather than visual noise.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="border-b border-light-accent/40 pb-6">
                <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-3">
                  Do you handle turnkey execution?
                </h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light">
                  Yes. We manage the entire lifecycle of the design and realization process, including layout mapping, bespoke furniture curation, procurement, vendor coordination, and strict design auditing on-site.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <div className="border-b border-light-accent/40 pb-6">
                <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-3">
                  Where do you provide services?
                </h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light">
                  Our main design studio is based in Ahmedabad, Gujarat. However, we regularly consult and deliver luxury turnkey villas and commercial projects across major metropolitan cities throughout India.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>
      </div>

      {/* 10. CONTACT CTA */}
      <section className="py-24 sm:py-32 bg-charcoal border-t border-light-accent/15 text-center relative overflow-hidden text-soft-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-light-accent/10 via-transparent to-transparent opacity-50 z-0" />
        
        <Container className="relative z-10 max-w-3xl">
          <RevealOnScroll>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-4 block">
              BEGIN YOUR TRANSFORMATION
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-soft-white tracking-wide leading-tight mb-8">
              Let’s Craft Your Vision Into Reality
            </h2>
            <p className="text-sm sm:text-base text-soft-white/70 font-light leading-relaxed max-w-lg mx-auto mb-10">
              Schedule a private design consultation with our architects to elevate your home or commercial environment.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Schedule Consultation
              </Button>
            </Link>
          </RevealOnScroll>
        </Container>
      </section>
    </PageTransition>
  );
}
