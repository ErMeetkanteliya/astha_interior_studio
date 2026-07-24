import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/lib/models/Admin';
import FailedLogin from '@/lib/models/FailedLogin';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Extract IP address from request headers
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const normalizedEmail = email.trim().toLowerCase();

    await connectDB();

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // 1. Check if user is currently blocked
    let failedRecord = await FailedLogin.findOne({ email: normalizedEmail, ip });

    if (failedRecord) {
      // If block expired, reset attempts
      if (failedRecord.blockedUntil && failedRecord.blockedUntil < now) {
        failedRecord.attempts = 0;
        failedRecord.blockedUntil = undefined;
        await failedRecord.save();
      }
      
      // If block is active, reject immediately
      if (failedRecord.blockedUntil && failedRecord.blockedUntil > now) {
        return NextResponse.json(
          { success: false, error: 'Too many failed login attempts. Please try again after one hour.' },
          { status: 429 }
        );
      }

      // If last attempt was over 1 hour ago, reset the count window
      if (failedRecord.lastAttempt < oneHourAgo) {
        failedRecord.attempts = 0;
        failedRecord.blockedUntil = undefined;
        await failedRecord.save();
      }
    }

    // 2. Validate user credentials
    const admin = await Admin.findOne({ email: normalizedEmail });
    let isMatch = false;

    if (admin) {
      isMatch = await bcrypt.compare(password, admin.password);
    }

    if (!isMatch) {
      // 3. Handle login failure (Increment counter)
      if (!failedRecord) {
        failedRecord = new FailedLogin({
          email: normalizedEmail,
          ip,
          attempts: 1,
          lastAttempt: now,
        });
      } else {
        failedRecord.attempts += 1;
        failedRecord.lastAttempt = now;
      }

      // Lock if max limit reached
      if (failedRecord.attempts >= 6) {
        failedRecord.blockedUntil = new Date(now.getTime() + 60 * 60 * 1000); // block for 1 hour
      }

      await failedRecord.save();

      if (failedRecord.attempts >= 6) {
        return NextResponse.json(
          { success: false, error: 'Too many failed login attempts. Please try again after one hour.' },
          { status: 429 }
        );
      }

      const attemptsRemaining = 6 - failedRecord.attempts;
      return NextResponse.json(
        { success: false, error: `Invalid credentials. ${attemptsRemaining} attempts remaining.` },
        { status: 401 }
      );
    }

    // 4. Handle login success (Reset failed logins)
    if (failedRecord) {
      await FailedLogin.deleteOne({ _id: failedRecord._id });
    }

    // Sign JWT token
    const token = signToken({ email: admin!.email, isAdmin: true });

    // Set cookie response
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
