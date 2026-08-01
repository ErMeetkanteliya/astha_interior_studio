import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import TeamMember from '@/lib/models/TeamMember';
import cloudinary from '@/lib/cloudinary';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const teamMemberUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Full Name is required'),
  designation: z.string().trim().min(1, 'Designation / Role is required'),
  image: z.object({
    url: z.string().min(1, 'Profile image URL is required'),
    publicId: z.string().min(1, 'Profile image public ID is required'),
  }),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    const validatedData = teamMemberUpdateSchema.parse(body);

    await connectDB();

    const oldMember = await TeamMember.findById(id);
    if (!oldMember) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    // Cloudinary Integrity: Check if profile image changed and delete old image from Cloudinary
    if (oldMember.image?.publicId !== validatedData.image.publicId) {
      if (oldMember.image?.publicId && !oldMember.image.publicId.startsWith('static_team_')) {
        try {
          await cloudinary.uploader.destroy(oldMember.image.publicId);
        } catch (err) {
          console.error('Failed to destroy old profile image:', err);
        }
      }
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      id,
      validatedData,
      { new: true }
    );

    return NextResponse.json({ success: true, teamMember: updatedMember });
  } catch (err: any) {
    console.error('Team member update API error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update team member' },
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

    const member = await TeamMember.findById(id);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    // Delete image from Cloudinary if not static placeholder
    if (member.image && member.image.publicId && !member.image.publicId.startsWith('static_team_')) {
      try {
        await cloudinary.uploader.destroy(member.image.publicId);
      } catch (cloudErr) {
        console.error('Failed to delete profile image from Cloudinary:', cloudErr);
      }
    }

    await TeamMember.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (err: any) {
    console.error('Team member delete API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
