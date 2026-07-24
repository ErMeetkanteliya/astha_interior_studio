import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICloudinaryImage {
  url: string;
  publicId: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  category: 'Residential' | 'Commercial' | 'Office' | 'Villa' | 'Apartment' | 'Restaurant' | 'Hotel' | 'Renovation' | 'Custom';
  location: string;
  shortDescription: string;
  fullDescription: string;
  featuredImage: ICloudinaryImage;
  galleryImages: ICloudinaryImage[];
  servicesUsed: string[];
  status: 'Draft' | 'Published' | 'Archived';
  completedDate: Date;
  clientName?: string;
  area?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CloudinaryImageSchema = new Schema<ICloudinaryImage>({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
}, { _id: false });

const ProjectSchema: Schema<IProject> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: {
        values: ['Residential', 'Commercial', 'Office', 'Villa', 'Apartment', 'Restaurant', 'Hotel', 'Renovation', 'Custom'],
        message: '{VALUE} is not a valid project category',
      },
    },
    location: {
      type: String,
      required: [true, 'Project location is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true,
    },
    featuredImage: {
      type: CloudinaryImageSchema,
      required: [true, 'Featured image is required'],
    },
    galleryImages: {
      type: [CloudinaryImageSchema],
      default: [],
    },
    servicesUsed: {
      type: [String],
      required: [true, 'At least one service is required'],
    },
    status: {
      type: String,
      required: [true, 'Project status is required'],
      enum: {
        values: ['Draft', 'Published', 'Archived'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Draft',
    },
    completedDate: {
      type: Date,
      required: [true, 'Completion date is required'],
    },
    clientName: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index slug for ultra fast lookup on detail page
ProjectSchema.index({ slug: 1 });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
