import React from 'react';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import { Container } from '@/components/ui/Container';
import { ImageGallery } from '@/components/shared/ImageGallery';
import { PageTransition } from '@/components/shared/PageTransition';
import { ICloudinaryImage } from '@/lib/models/Project';

export const revalidate = 0;

export default async function GalleryPage() {
  let allImages: ICloudinaryImage[] = [];

  try {
    await connectDB();
    
    // Fetch all published projects to pull images
    const projects = await Project.find({ status: 'Published' })
      .select('featuredImage galleryImages')
      .lean();
    
    // Gather featured and gallery images
    projects.forEach((proj) => {
      if (proj.featuredImage) {
        allImages.push(JSON.parse(JSON.stringify(proj.featuredImage)));
      }
      if (proj.galleryImages && proj.galleryImages.length > 0) {
        proj.galleryImages.forEach((img) => {
          allImages.push(JSON.parse(JSON.stringify(img)));
        });
      }
    });

    // Deduplicate images based on publicId
    const seen = new Set<string>();
    allImages = allImages.filter((img) => {
      const duplicate = seen.has(img.publicId);
      seen.add(img.publicId);
      return !duplicate;
    });

  } catch (err) {
    console.error('Failed to load gallery images from projects:', err);
  }

  return (
    <PageTransition>
      {/* Banner */}
      <section className="py-20 sm:py-28 bg-off-white border-b border-light-accent/15">
        <Container>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary-accent mb-4 block text-center">
            VISUAL INSPIRATION
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-deep-black tracking-wide text-center max-w-4xl mx-auto leading-tight">
            Studio Gallery
          </h1>
          <div className="w-16 h-[1px] bg-primary-accent mx-auto mt-6" />
        </Container>
      </section>

      {/* Gallery Showcase */}
      <section className="py-20 sm:py-28 bg-soft-white">
        <Container>
          {allImages.length === 0 ? (
            <div className="text-center py-24 bg-off-white border border-light-accent/30 text-charcoal/45 font-light tracking-wide text-sm">
              No images found. Upload featured or gallery images inside Projects to populate this page.
            </div>
          ) : (
            <ImageGallery images={allImages} />
          )}
        </Container>
      </section>
    </PageTransition>
  );
}
