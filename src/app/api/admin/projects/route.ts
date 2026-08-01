import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  category: z.enum(['Residential', 'Commercial', 'Office', 'Villa', 'Apartment', 'Restaurant', 'Hotel', 'Renovation', 'Custom']),
  location: z.string().trim().min(1, 'Location is required'),
  shortDescription: z.string().trim().min(1, 'Short description is required'),
  fullDescription: z.string().trim().min(1, 'Full description is required'),
  featuredImage: z.object({
    url: z.string().url('Featured Image must be a valid Cloudinary URL'),
    publicId: z.string().min(1, 'Featured Image public ID is required'),
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

export async function POST(request: Request) {
  try {
    // 1. Authenticate session
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // 2. Validate data
    const validatedData = projectSchema.parse(body);

    await connectDB();

    // 3. Generate Unique Slug from Title
    const baseSlug = validatedData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    let slug = baseSlug;
    let slugExists = await Project.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${baseSlug}-${counter}`;
      slugExists = await Project.findOne({ slug });
      counter++;
    }

    // 4. Create Project Document
    const project = await Project.create({
      ...validatedData,
      slug,
      completedDate: new Date(validatedData.completedDate),
      clientName: validatedData.clientName || undefined,
      area: validatedData.area || undefined,
    });

    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    console.error('Project creation API error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}
