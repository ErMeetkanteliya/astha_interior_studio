import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Strict authentication check
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Stream upload directly to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `astha_interior_studio/${folder}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result!.secure_url,
                publicId: result!.public_id,
              });
            }
          }
        );
        stream.end(buffer);
      });
    };

    const uploadResult = await uploadToCloudinary();
    return NextResponse.json({ success: true, ...uploadResult });
  } catch (err: any) {
    console.error('File upload API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
export const maxDuration = 60; // Allow sufficient stream timeout (Vercel)
