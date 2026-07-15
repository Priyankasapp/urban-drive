import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOffer extends Document {
  code: string;
  discountPercentage: number;
  description: string;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);
export default Offer;
