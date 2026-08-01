import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db';
import TeamMember from '@/lib/models/TeamMember';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const teamMemberSchema = z.object({
  name: z.string().trim().min(1, 'Full Name is required'),
  designation: z.string().trim().min(1, 'Designation / Role is required'),
  image: z.object({
    url: z.string().min(1, 'Profile image URL is required'),
    publicId: z.string().min(1, 'Profile image public ID is required'),
  }),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const teamMembers = await TeamMember.find().sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ success: true, teamMembers });
  } catch (err: any) {
    console.error('Fetch team members API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = teamMemberSchema.parse(body);

    await connectDB();

    const teamMember = await TeamMember.create(validatedData);
    revalidatePath('/about');

    return NextResponse.json({ success: true, teamMember });
  } catch (err: any) {
    console.error('Team member creation API error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create team member' },
      { status: 500 }
    );
  }
}
