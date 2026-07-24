import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const profileUpdateSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().trim().optional().nullable(),
});

export async function PUT(request: Request) {
  try {
    // 1. Authenticate session
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // 2. Validate input
    const validatedData = profileUpdateSchema.parse(body);

    await connectDB();

    // 3. Find Admin user (matches token email)
    const admin = await Admin.findOne({ email: payload.email });
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin account not found' }, { status: 404 });
    }

    // 4. Check email conflict
    if (admin.email !== validatedData.email) {
      const conflict = await Admin.findOne({ email: validatedData.email });
      if (conflict) {
        return NextResponse.json(
          { success: false, error: 'Email address is already in use by another admin' },
          { status: 400 }
        );
      }
      admin.email = validatedData.email;
    }

    // 5. Update password if provided
    if (validatedData.password && validatedData.password.length > 0) {
      if (validatedData.password.length < 8) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }
      admin.password = await bcrypt.hash(validatedData.password, 10);
    }

    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Profile settings updated successfully',
    });
  } catch (err: any) {
    console.error('Profile update API error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
