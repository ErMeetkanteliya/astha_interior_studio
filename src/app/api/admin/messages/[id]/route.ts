import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ContactMessage from '@/lib/models/ContactMessage';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

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

    await connectDB();

    // 2. Fetch Message
    const message = await ContactMessage.findById(id);
    if (!message) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    // 3. Mark as read & update viewedAt if first time opening
    if (!message.read) {
      message.read = true;
      message.viewedAt = new Date();
      await message.save();
    }

    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    console.error('Update message API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update message status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // 1. Authenticate Admin session
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    await connectDB();

    // 2. Delete document
    await ContactMessage.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (err: any) {
    console.error('Delete message API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete message' },
      { status: 500 }
    );
  }
}
