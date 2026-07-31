import mongoose from 'mongoose';
import Admin from './models/Admin';
import StudioInfo from './models/StudioInfo';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCached: GlobalMongoose | undefined;
}

let cached = global.mongooseCached;

if (!cached) {
  cached = global.mongooseCached = {
    conn: null,
    promise: null,
  };
}

async function seedDatabase() {
  try {
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

      await Admin.create({
        email: 'admin@asthainterior.com',
        password: hashedPassword,
      });

      console.log('Default admin created.');
    }

    const infoCount = await StudioInfo.countDocuments();

    if (infoCount === 0) {
      await StudioInfo.create({
        companyName: 'ASTHA',
        heroTitle: 'Crafting Premium Spaces That Inspire',
        heroSubtitle:
          'Luxury Residential & Commercial Interior Design Studio based in India.',
        aboutTitle: 'Elevating Spaces, Redefining Luxury',
        aboutSubtitle: 'THE ART OF INTERIOR DESIGN',
        aboutDescription:
          'We believe that exceptional design is a synthesis of form, function, and emotion. Our studio specializes in high-end, custom residential and commercial spaces that blend warm minimalism with premium comfort. Every project is curated to tell a unique story of refinement and sophistication.',
        phone: '+91 98765 43210',
        email: 'info@asthainterior.com',
        address: 'Luxury Heights, Suite 404, Ahmedabad, Gujarat, India',
        googleMapsUrl: 'https://maps.google.com',
        instagram: 'https://instagram.com/asthainterior',
        facebook: 'https://facebook.com/asthainterior',
        pinterest: 'https://pinterest.com/asthainterior',
        linkedin: 'https://linkedin.com/company/asthainterior',
        footerCopyright: '© 2026 ASTHA Interior Studio. All rights reserved.',
        seoTitle: 'ASTHA Interior Studio | Luxury Interior Design',
        seoDescription:
          'Premium interior design and architecture studio specializing in high-end residential, commercial, villa, and luxury office renovations.',
        seoKeywords:
          'interior design, luxury home decor, premium architecture, villa renovations, office design, Ahmedabad, custom interior',
        stat1Value: '150+',
        stat1Label: 'Projects Completed',
        stat2Value: '8+',
        stat2Label: 'Years Experience',
        stat3Value: '98%',
        stat3Label: 'Client Satisfaction',
        stat4Value: '24/7',
        stat4Label: 'Support',
      });

      console.log('Default studio info created.');
    }
  } catch (err) {
    console.error('Error during auto-seeding:', err);
  }
}

async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose
      .connect(MONGODB_URI!, {
        bufferCommands: false,
      })
      .then(async (mongooseInstance) => {
        await seedDatabase();
        return mongooseInstance;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw error;
  }

  return cached!.conn;
}

export default connectDB;