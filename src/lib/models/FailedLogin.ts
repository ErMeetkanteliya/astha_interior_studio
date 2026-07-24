import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFailedLogin extends Document {
  email: string;
  ip: string;
  attempts: number;
  blockedUntil?: Date;
  lastAttempt: Date;
}

const FailedLoginSchema: Schema<IFailedLogin> = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    ip: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    blockedUntil: {
      type: Date,
    },
    lastAttempt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Index to automatically clear failed login attempts that are older than 24 hours (optional clean-up)
// FailedLoginSchema.index({ lastAttempt: 1 }, { expireAfterSeconds: 86400 });

const FailedLogin: Model<IFailedLogin> =
  mongoose.models.FailedLogin || mongoose.model<IFailedLogin>('FailedLogin', FailedLoginSchema);

export default FailedLogin;
