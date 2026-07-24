import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { PageTransition, RevealOnScroll } from '@/components/shared/PageTransition';

const SERVICES_DATA = [
  {
    index: '01',
    title: 'Residential Interior Design',
    category: 'VILLAS, APARTMENTS & PENTHOUSES',
    description: 'We craft private sanctuaries customized to your style profile. From spatial planning and custom cabinet templates to furniture procurement, we curate premium textures and finishes to create warm, minimalist homes.',
    image: '/images/service-1.jpg',
  },
  {
    index: '02',
    title: 'Commercial Design',
    category: 'WORKSPACES, SHOWROOMS & HOSPITALITY',
    description: 'Premium layouts that balance corporate efficiency with luxurious design language. We plan corporate offices, boutique retail lounges, and hospitality spaces that impress business visitors within seconds.',
    image: '/images/service-2.jpg',
  },
  {
    index: '03',
    title: 'Bespoke Furniture Curation',
    category: 'CURATED SELECTIONS & CONSULTATION',
    description: 'Custom furniture configurations, luxury hardware sourcing, lighting arrangements, and material matching. We secure high-quality pieces from trusted premium manufacturers, matching your spatial architecture.',
    image: '/images/service-3.jpg',
  },
];

export default function ServicesPage() {
  return (
    <PageTransition>
      {/* Header */}
      <section className="py-20 sm:py-28 bg-off-white border-b border-light-accent/15">
        <Container>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-4 block text-center">
            CREATIVE EXPERTISE
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-deep-black tracking-wide text-center max-w-4xl mx-auto leading-tight">
            Our Luxury Services
          </h1>
          <div className="w-16 h-[1px] bg-primary-accent mx-auto mt-6" />
        </Container>
      </section>

      {/* Services List Grid */}
      <section className="py-20 sm:py-28 bg-soft-white">
        <Container>
          <div className="flex flex-col gap-24 sm:gap-32">
            {SERVICES_DATA.map((service, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={service.index}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
                >
                  {/* Image container */}
                  <div className={isEven ? 'lg:col-span-6' : 'lg:col-span-6 lg:order-2'}>
                    <RevealOnScroll direction={isEven ? 'left' : 'right'}>
                      <div className="relative aspect-[16/10] w-full overflow-hidden border border-light-accent/30 bg-off-white">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-[1200ms] hover:scale-103"
                        />
                      </div>
                    </RevealOnScroll>
                  </div>

                  {/* Content Container */}
                  <div className={isEven ? 'lg:col-span-6' : 'lg:col-span-6 lg:order-1'}>
                    <RevealOnScroll direction="up">
                      <span className="font-serif text-xs font-semibold tracking-widest text-primary-accent mb-3 block">
                        {service.index} / {service.category}
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide leading-tight mb-6">
                        {service.title}
                      </h2>
                      <div className="w-10 h-[1px] bg-primary-accent mb-6" />
                      <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light mb-8">
                        {service.description}
                      </p>
                      <Link href="/contact">
                        <Button variant="secondary" size="md">
                          Request Consultation
                        </Button>
                      </Link>
                    </RevealOnScroll>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Dynamic CTA Banner */}
      <section className="py-24 bg-charcoal text-soft-white text-center">
        <Container className="max-w-3xl">
          <RevealOnScroll>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary-accent mb-4 block">
              COLLABORATIVE PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-soft-white tracking-wide leading-tight mb-6">
              Ready to Shape Your Spaces?
            </h2>
            <p className="text-xs sm:text-sm text-soft-white/60 font-light leading-relaxed max-w-lg mx-auto mb-10">
              Schedule a design review session with our principal planners to discuss layout guidelines and premium procurement budgets.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Start Design Review
              </Button>
            </Link>
          </RevealOnScroll>
        </Container>
      </section>
    </PageTransition>
  );
}
