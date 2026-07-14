import { Schema, models, model, Types } from "mongoose";

export interface ICar {
  name: string;
  slug: string;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  location: Types.ObjectId;
  pricePerDay: number;
  transmission: "manual" | "automatic";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  seats: number;
  images: string[];
  description: string;
  status: "available" | "booked" | "maintenance";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema<ICar>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    pricePerDay: {
      type: Number,
      required: true,
      min: [1, "Price per day must be greater than 0"],
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid"],
      required: true,
    },
    seats: { type: Number, required: true, min: 1 },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one image is required",
      },
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Car = models.Car || model<ICar>("Car", CarSchema);
export default Car;
