import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICloudinaryImage } from './Project';

export interface IStudioInfo extends Document {
  companyName: string;
  logo?: ICloudinaryImage;
  heroImage?: ICloudinaryImage;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutImage?: ICloudinaryImage;
  phone: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  instagram: string;
  facebook: string;
  pinterest: string;
  linkedin: string;
  footerCopyright: string;

  // SEO Settings
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  openGraphImage?: ICloudinaryImage;
  favicon?: ICloudinaryImage;

  // Statistics
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
}

const CloudinaryImageSchema = new Schema<ICloudinaryImage>({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
}, { _id: false });

const StudioInfoSchema: Schema<IStudioInfo> = new Schema(
  {
    companyName: {
      type: String,
      default: 'ASTHA',
      trim: true,
    },
    logo: {
      type: CloudinaryImageSchema,
    },
    heroImage: {
      type: CloudinaryImageSchema,
    },
    heroTitle: {
      type: String,
      default: 'Crafting Premium Spaces That Inspire',
    },
    heroSubtitle: {
      type: String,
      default: 'Luxury Residential & Commercial Interior Design Studio based in India.',
    },
    aboutTitle: {
      type: String,
      default: 'Elevating Spaces, Redefining Luxury',
    },
    aboutSubtitle: {
      type: String,
      default: 'THE ART OF INTERIOR DESIGN',
    },
    aboutDescription: {
      type: String,
      default: 'We believe that exceptional design is a synthesis of form, function, and emotion. Our studio specializes in high-end, custom residential and commercial spaces that blend warm minimalism with premium comfort. Every project is curated to tell a unique story of refinement and sophistication.',
    },
    aboutImage: {
      type: CloudinaryImageSchema,
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    email: {
      type: String,
      default: 'info@asthainterior.com',
    },
    address: {
      type: String,
      default: 'Luxury Heights, Suite 404, Ahmedabad, Gujarat, India',
    },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com',
    },
    instagram: {
      type: String,
      default: 'https://instagram.com/asthainterior',
    },
    facebook: {
      type: String,
      default: 'https://facebook.com/asthainterior',
    },
    pinterest: {
      type: String,
      default: 'https://pinterest.com/asthainterior',
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com/company/asthainterior',
    },
    footerCopyright: {
      type: String,
      default: '© 2026 ASTHA Interior Studio. All rights reserved.',
    },

    // SEO Settings
    seoTitle: {
      type: String,
      default: 'ASTHA Interior Studio | Luxury Interior Design',
    },
    seoDescription: {
      type: String,
      default: 'Premium interior design and architecture studio specializing in high-end residential, commercial, villa, and luxury office renovations.',
    },
    seoKeywords: {
      type: String,
      default: 'interior design, luxury home decor, premium architecture, villa renovations, office design, Ahmedabad, custom interior',
    },
    openGraphImage: {
      type: CloudinaryImageSchema,
    },
    favicon: {
      type: CloudinaryImageSchema,
    },

    // Statistics
    stat1Value: {
      type: String,
      default: '150+',
    },
    stat1Label: {
      type: String,
      default: 'Projects Completed',
    },
    stat2Value: {
      type: String,
      default: '8+',
    },
    stat2Label: {
      type: String,
      default: 'Years Experience',
    },
    stat3Value: {
      type: String,
      default: '98%',
    },
    stat3Label: {
      type: String,
      default: 'Client Satisfaction',
    },
    stat4Value: {
      type: String,
      default: '24/7',
    },
    stat4Label: {
      type: String,
      default: 'Support',
    },
  },
  {
    timestamps: false,
  }
);

const StudioInfo: Model<IStudioInfo> =
  mongoose.models.StudioInfo || mongoose.model<IStudioInfo>('StudioInfo', StudioInfoSchema);

export default StudioInfo;
