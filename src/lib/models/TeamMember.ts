import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICloudinaryImage } from './Project';

export interface ITeamMember extends Document {
  name: string;
  designation: string;
  image: ICloudinaryImage;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CloudinaryImageSchema = new Schema<ICloudinaryImage>({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
}, { _id: false });

const TeamMemberSchema: Schema<ITeamMember> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    image: {
      type: CloudinaryImageSchema,
      required: [true, 'Profile image is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);

export default TeamMember;
