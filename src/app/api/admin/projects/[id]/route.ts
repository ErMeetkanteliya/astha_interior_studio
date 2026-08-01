import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import cloudinary from '@/lib/cloudinary';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const projectUpdateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  category: z.enum(['Residential', 'Commercial', 'Office', 'Villa', 'Apartment', 'Restaurant', 'Hotel', 'Renovation', 'Custom']),
  location: z.string().trim().min(1, 'Location is required'),
  shortDescription: z.string().trim().min(1, 'Short description is required'),
  fullDescription: z.string().trim().min(1, 'Full description is required'),
  featuredImage: z.object({
    url: z.string().url(),
    publicId: z.string().min(1),
  }),
  galleryImages: z.array(
    z.object({
      url: z.string().url(),
      publicId: z.string(),
    })
  ).default([]),
  servicesUsed: z.array(z.string()).min(1, 'At least one service is required'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  completedDate: z.string().min(1, 'Completed Date is required'),
  clientName: z.string().optional().nullable(),
  area: z.string().optional().nullable(),
});

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // 1. Authenticate Admin session
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    
    // 2. Validate data
    const validatedData = projectUpdateSchema.parse(body);

    await connectDB();

    // 3. Find old Project document
    const oldProject = await Project.findById(id);
    if (!oldProject) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // 4. Cloudinary Integrity: Check if featured image changed and delete old
    if (oldProject.featuredImage?.publicId !== validatedData.featuredImage.publicId) {
      if (oldProject.featuredImage?.publicId) {
        try {
          await cloudinary.uploader.destroy(oldProject.featuredImage.publicId);
        } catch (err) {
          console.error('Failed to destroy old featured image:', err);
        }
      }
    }

    // 5. Cloudinary Integrity: Check which gallery images were removed and delete them
    const newGalleryPublicIds = new Set(validatedData.galleryImages.map((img) => img.publicId));
    const oldGalleryImages = oldProject.galleryImages || [];
    
    for (const img of oldGalleryImages) {
      if (img.publicId && !newGalleryPublicIds.has(img.publicId)) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (err) {
          console.error('Failed to destroy removed gallery image:', err);
        }
      }
    }

    // 6. Generate Slug if title changed
    let slug = oldProject.slug;
    if (oldProject.title !== validatedData.title) {
      const baseSlug = validatedData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      slug = baseSlug;
      let slugExists = await Project.findOne({ slug, _id: { $ne: id } });
      let counter = 1;
      while (slugExists) {
        slug = `${baseSlug}-${counter}`;
        slugExists = await Project.findOne({ slug, _id: { $ne: id } });
        counter++;
      }
    }

    // 7. Update database record
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        slug,
        completedDate: new Date(validatedData.completedDate),
        clientName: validatedData.clientName || undefined,
        area: validatedData.area || undefined,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (err: any) {
    console.error('Project update API error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    await connectDB();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Delete featured image from Cloudinary
    if (project.featuredImage && project.featuredImage.publicId) {
      try {
        await cloudinary.uploader.destroy(project.featuredImage.publicId);
      } catch (cloudErr) {
        console.error('Failed to delete featured image from Cloudinary:', cloudErr);
      }
    }

    // Delete gallery images from Cloudinary
    if (project.galleryImages && project.galleryImages.length > 0) {
      for (const img of project.galleryImages) {
        if (img.publicId) {
          try {
            await cloudinary.uploader.destroy(img.publicId);
          } catch (cloudErr) {
            console.error('Failed to delete gallery image from Cloudinary:', cloudErr);
          }
        }
      }
    }

    // Delete record from database
    await Project.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Project and all associated images deleted successfully',
    });
  } catch (err: any) {
    console.error('Project delete API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
