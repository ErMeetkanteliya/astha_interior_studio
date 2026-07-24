import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ContactMessage from '@/lib/models/ContactMessage';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().min(8, 'Phone number is too short'),
  projectType: z.enum(['Residential', 'Commercial', 'Office', 'Villa', 'Apartment', 'Restaurant', 'Hotel', 'Renovation', 'Custom']),
  message: z.string().trim().min(5, 'Message must be at least 5 characters long'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate inputs
    const validatedData = contactSchema.parse(body);

    await connectDB();
    
    // Store message
    await ContactMessage.create(validatedData);

    return NextResponse.json({ success: true, message: 'Your message has been received' });
  } catch (err: any) {
    console.error('Contact submission error:', err);
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
