import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import StudioInfo from '@/lib/models/StudioInfo';
import cloudinary from '@/lib/cloudinary';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { revalidatePath } from "next/cache";

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
}).nullable().optional();

const studioInfoUpdateSchema = z.object({
  companyName: z.string().trim().min(1, 'Company Name is required'),
  logo: imageSchema,
  heroImage: imageSchema,
  heroTitle: z.string().trim().min(1, 'Hero Title is required'),
  heroSubtitle: z.string().trim().min(1, 'Hero Subtitle is required'),
  aboutTitle: z.string().trim().min(1, 'About Title is required'),
  aboutSubtitle: z.string().trim().min(1, 'About Subtitle is required'),
  aboutDescription: z.string().trim().min(1, 'About Description is required'),
  aboutImage: imageSchema,
  phone: z.string().trim().min(1, 'Phone is required'),
  email: z.string().trim().email('Invalid email address'),
  address: z.string().trim().min(1, 'Address is required'),
  googleMapsUrl: z.string().trim().min(1, 'Google Maps URL is required'),
  instagram: z.string().trim().optional(),
  facebook: z.string().trim().optional(),
  pinterest: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  footerCopyright: z.string().trim().min(1, 'Footer Copyright is required'),

  // SEO Settings
  seoTitle: z.string().trim().min(1, 'SEO Title is required'),
  seoDescription: z.string().trim().min(1, 'SEO Description is required'),
  seoKeywords: z.string().trim().min(1, 'SEO Keywords are required'),
  openGraphImage: imageSchema,
  favicon: imageSchema,

  // Statistics
  stat1Value: z.string().trim().min(1, 'Stat 1 Value is required'),
  stat1Label: z.string().trim().min(1, 'Stat 1 Label is required'),
  stat2Value: z.string().trim().min(1, 'Stat 2 Value is required'),
  stat2Label: z.string().trim().min(1, 'Stat 2 Label is required'),
  stat3Value: z.string().trim().min(1, 'Stat 3 Value is required'),
  stat3Label: z.string().trim().min(1, 'Stat 3 Label is required'),
  stat4Value: z.string().trim().min(1, 'Stat 4 Value is required'),
  stat4Label: z.string().trim().min(1, 'Stat 4 Label is required'),
});

export async function PUT(request: Request) {
  try {
    // 1. Authenticate Admin session
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // 2. Validate data
    const validatedData = studioInfoUpdateSchema.parse(body);

    await connectDB();

    // 3. Find current StudioInfo document
    const oldInfo = await StudioInfo.findOne();

    if (oldInfo) {
      // 4. Cloudinary Integrity: Check logo replacement
      if (oldInfo.logo?.publicId !== validatedData.logo?.publicId) {
        if (oldInfo.logo?.publicId) {
          try {
            await cloudinary.uploader.destroy(oldInfo.logo.publicId);
          } catch (err) {
            console.error('Failed to destroy logo:', err);
          }
        }
      }

      // Check heroImage replacement
      if (oldInfo.heroImage?.publicId !== validatedData.heroImage?.publicId) {
        if (oldInfo.heroImage?.publicId) {
          try {
            await cloudinary.uploader.destroy(oldInfo.heroImage.publicId);
          } catch (err) {
            console.error('Failed to destroy heroImage:', err);
          }
        }
      }

      // Check aboutImage replacement
      if (oldInfo.aboutImage?.publicId !== validatedData.aboutImage?.publicId) {
        if (oldInfo.aboutImage?.publicId) {
          try {
            await cloudinary.uploader.destroy(oldInfo.aboutImage.publicId);
          } catch (err) {
            console.error('Failed to destroy aboutImage:', err);
          }
        }
      }

      // Check openGraphImage replacement
      if (oldInfo.openGraphImage?.publicId !== validatedData.openGraphImage?.publicId) {
        if (oldInfo.openGraphImage?.publicId) {
          try {
            await cloudinary.uploader.destroy(oldInfo.openGraphImage.publicId);
          } catch (err) {
            console.error('Failed to destroy openGraphImage:', err);
          }
        }
      }

      // Check favicon replacement
      if (oldInfo.favicon?.publicId !== validatedData.favicon?.publicId) {
        if (oldInfo.favicon?.publicId) {
          try {
            await cloudinary.uploader.destroy(oldInfo.favicon.publicId);
          } catch (err) {
            console.error('Failed to destroy favicon:', err);
          }
        }
      }
    }

    // 5. Update MongoDB document
    const updatedInfo = await StudioInfo.findOneAndUpdate(
      {},
      validatedData,
      { new: true, upsert: true }
    );

    // Revalidate cache
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/services");
    revalidatePath("/projects");

    return NextResponse.json({ success: true, studioInfo: updatedInfo });
  } catch (err: any) {
    console.error('StudioInfo update API error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update studio info' },
      { status: 500 }
    );
  }
}
