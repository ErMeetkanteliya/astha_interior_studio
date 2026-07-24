import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone: string;
  projectType: 'Residential' | 'Commercial' | 'Office' | 'Villa' | 'Apartment' | 'Restaurant' | 'Hotel' | 'Renovation' | 'Custom';
  message: string;
  read: boolean;
  viewedAt?: Date;
  createdAt: Date;
}

const ContactMessageSchema: Schema<IContactMessage> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    projectType: {
      type: String,
      required: [true, 'Project type is required'],
      enum: {
        values: ['Residential', 'Commercial', 'Office', 'Villa', 'Apartment', 'Restaurant', 'Hotel', 'Renovation', 'Custom'],
        message: '{VALUE} is not a valid project type',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    viewedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We use custom createdAt defaults
  }
);

const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

export default ContactMessage;
