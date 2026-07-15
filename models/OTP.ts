import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOTP extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-delete document after expiresAt
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OTPSchema.index({ email: 1 });

const OTP: Model<IOTP> = mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);
export default OTP;
