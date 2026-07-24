import React from 'react';
import Image from 'next/image';
import connectDB from '@/lib/db';
import StudioInfo from '@/lib/models/StudioInfo';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { PageTransition, RevealOnScroll } from '@/components/shared/PageTransition';

const DEFAULT_ABOUT_IMAGE = '/images/about.jpg';
const DEFAULT_PHILOSOPHY_IMAGE = '/images/about-philosophy.jpg';

// Static Team Members (as required)
const TEAM_MEMBERS = [
  {
    name: 'Astha Patel',
    role: 'Principal Designer & Founder',
    image: '/images/team-1.jpg',
  },
  {
    name: 'Kabir Mehta',
    role: 'Lead Architect',
    image: '/images/team-2.jpg',
  },
  {
    name: 'Meera Sen',
    role: 'Interior Stylist',
    image: '/images/team-3.jpg',
  },
];

export default async function AboutPage() {
  let studioData = {} as any;

  try {
    await connectDB();
    const info = await StudioInfo.findOne().lean();
    if (info) {
      studioData = JSON.parse(JSON.stringify(info));
    }
  } catch (err) {
    console.error('Failed to load about details:', err);
  }

  const companyName = studioData.companyName || 'ASTHA';
  const aboutTitle = studioData.aboutTitle || 'Elevating Spaces, Redefining Luxury';
  const aboutSubtitle = studioData.aboutSubtitle || 'THE ART OF INTERIOR DESIGN';
  const aboutDescription = studioData.aboutDescription || 'We believe that exceptional design is a synthesis of form, function, and emotion. Our studio specializes in high-end, custom residential and commercial spaces that blend warm minimalism with premium comfort. Every project is curated to tell a unique story of refinement and sophistication.';
  const aboutImage = studioData.aboutImage?.url || DEFAULT_ABOUT_IMAGE;

  return (
    <PageTransition>
      {/* Hero Header */}
      <section className="py-20 sm:py-28 bg-off-white border-b border-light-accent/15">
        <Container>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-4 block text-center">
            {aboutSubtitle}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-deep-black tracking-wide text-center max-w-4xl mx-auto leading-tight">
            Our Studio Story
          </h1>
          <div className="w-16 h-[1px] bg-primary-accent mx-auto mt-6" />
        </Container>
      </section>

      {/* Main Philosophy Grid */}
      <section className="py-20 sm:py-28 bg-soft-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <RevealOnScroll direction="left">
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-light-accent/30 bg-off-white">
                  <Image
                    src={aboutImage}
                    alt={`${companyName} Design Philosophy`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </RevealOnScroll>
            </div>

            <div className="lg:col-span-6 flex flex-col items-start">
              <RevealOnScroll direction="up">
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-3 block">
                  FOUNDERS STATEMENT
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide leading-tight mb-6">
                  {aboutTitle}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light mb-6">
                  {aboutDescription}
                </p>
                <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
                  Our designs celebrate the beauty of raw textures, natural light alignment, and generous breathing space. We collaborate closely with our clients to transform structural constraints into bespoke realities.
                </p>
              </RevealOnScroll>
            </div>
          </div>
        </Container>
      </section>

      {/* Secondary Values Showcase */}
      <section className="py-20 bg-off-white border-y border-light-accent/15">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 lg:order-2">
              <RevealOnScroll direction="right">
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-light-accent/30 bg-soft-white">
                  <Image
                    src={DEFAULT_PHILOSOPHY_IMAGE}
                    alt="Precision execution"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </RevealOnScroll>
            </div>

            <div className="lg:col-span-6 lg:order-1 flex flex-col items-start">
              <RevealOnScroll direction="up">
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-3 block">
                  CRAFT & DILIGENCE
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide leading-tight mb-6">
                  Uncompromising Standards
                </h2>
                <div className="flex flex-col gap-6 text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
                  <p>
                    From early planning consultations to structural detailing, we ensure every element aligns with the highest quality standards. We work with leading manufacturers to secure custom hardware and custom cabinetry.
                  </p>
                  <p>
                    Every joint, shade transition, and accent trim is custom-inspected. We believe true luxury lies in absolute precision and materials integrity.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </Container>
      </section>

      {/* Static Team Members Section */}
      <section className="py-20 sm:py-28 bg-soft-white">
        <Container>
          <RevealOnScroll>
            <SectionTitle title="The Creative Minds" subtitle="OUR TEAM" />
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, idx) => (
              <RevealOnScroll key={idx} delay={idx * 0.15}>
                <div className="flex flex-col items-center text-center group">
                  <div className="relative aspect-[3/4] w-full overflow-hidden border border-light-accent/30 bg-off-white mb-6">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-xl font-medium tracking-wide text-deep-black group-hover:text-primary-accent transition-colors duration-300">
                    {member.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-charcoal/50 font-light mt-1.5">
                    {member.role}
                  </span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
