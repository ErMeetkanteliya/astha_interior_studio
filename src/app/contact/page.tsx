import React from 'react';
import connectDB from '@/lib/db';
import StudioInfo from '@/lib/models/StudioInfo';
import { Container } from '@/components/ui/Container';
import { PageTransition, RevealOnScroll } from '@/components/shared/PageTransition';
import { ContactForm } from './ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function ContactPage() {
  let studioData = {} as any;

  try {
    await connectDB();
    const info = await StudioInfo.findOne().lean();
    if (info) {
      studioData = JSON.parse(JSON.stringify(info));
    }
  } catch (err) {
    console.error('Failed to load contact page details:', err);
  }

  const {
    phone = '+91 98765 43210',
    email = 'info@asthainterior.com',
    address = 'Luxury Heights, Suite 404, Ahmedabad, Gujarat, India',
    googleMapsUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d85207.85380362882!2d70.35520638636658!3d21.530705715060762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3958018c6a277f53%3A0x13b52f8520a86e48!2sJunagadh%2C%20Gujarat!5e1!3m2!1sen!2sin!4v1785482361539!5m2!1sen!2sin',
  } = studioData;

  return (
    <PageTransition>
      <div className="bg-paper-texture">
        {/* Header */}
        <section className="py-20 sm:py-28 bg-off-white border-b border-light-accent/15">
          <Container>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-4 block text-center">
              GET IN TOUCH
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-light text-deep-black tracking-wide text-center max-w-4xl mx-auto leading-tight">
              Contact Our Studio
            </h1>
            <div className="w-16 h-[1px] bg-primary-accent mx-auto mt-6" />
          </Container>
        </section>

        {/* Main Grid: Info + Form */}
        <section className="py-20 sm:py-28 bg-soft-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left side: Contact Info Card */}
              <div className="lg:col-span-5 flex flex-col gap-10">
                <RevealOnScroll direction="left">
                  <div className="bg-off-white border border-light-accent p-8 sm:p-10 flex flex-col gap-6">
                    <h3 className="font-serif text-2xl font-light text-deep-black tracking-wide pb-4 border-b border-light-accent">
                      Inquiry Details
                    </h3>

                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 stroke-[1.5] text-primary-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] uppercase tracking-widest text-charcoal/40 font-semibold mb-0.5">Location</span>
                        <p className="text-xs sm:text-sm text-deep-black font-light leading-relaxed">{address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 stroke-[1.5] text-primary-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] uppercase tracking-widest text-charcoal/40 font-semibold mb-0.5">Email</span>
                        <a href={`mailto:${email}`} className="text-xs sm:text-sm text-deep-black hover:text-primary-accent transition-colors font-light">
                          {email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 stroke-[1.5] text-primary-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] uppercase tracking-widest text-charcoal/40 font-semibold mb-0.5">Call Us</span>
                        <a href={`tel:${phone}`} className="text-xs sm:text-sm text-deep-black hover:text-primary-accent transition-colors font-light">
                          {phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 stroke-[1.5] text-primary-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] uppercase tracking-widest text-charcoal/40 font-semibold mb-0.5">Studio Hours</span>
                        <span className="text-xs sm:text-sm text-deep-black font-light">Mon - Sat: 10:00 AM - 7:00 PM</span>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Embedded Google Maps block */}
                {googleMapsUrl && (
                  <RevealOnScroll direction="left" delay={0.15}>
                    <div className="w-full aspect-[4/3] border border-light-accent bg-off-white overflow-hidden relative">
                      <iframe
                        title="Google Maps Location"
                        src={googleMapsUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                      />
                    </div>
                  </RevealOnScroll>
                )}
              </div>

              {/* Right side: Contact Form */}
              <div className="lg:col-span-7">
                <RevealOnScroll direction="right">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-3 block">
                      CONSULTATION FORM
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide leading-tight mb-8">
                      Send Us a Message
                    </h2>
                    <ContactForm />
                  </div>
                </RevealOnScroll>
              </div>
              
            </div>
          </Container>
        </section>
      </div>
    </PageTransition>
  );
}
