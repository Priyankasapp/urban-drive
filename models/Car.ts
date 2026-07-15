import { Schema, models, model, Types } from "mongoose";

export interface ICar {
  name: string;
  slug: string;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  location: Types.ObjectId;
  pricePerDay: number;
  transmission: "Automatic" | "Manual";
  fuelType:
    "Electric (BEV)" | "Premium Gasoline" | "petrol" | "diesel" | "hybrid";
  seats: number;
  horsepower: number;
  acceleration: string;
  images: string[];
  description: string;
  status: "available" | "booked" | "maintenance" | "reserved" | "new";
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
      enum: ["Automatic", "Manual"], // Match capitalization from AddCarModal form
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["Premium Gasoline", "Electric (BEV)", "Hybrid", "Diesel"], // Accommodates both standards
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: [1, "Seats must be at least 1"],
    },
    horsepower: {
      type: Number,
      required: true,
      min: [1, "Horsepower must be greater than 0"],
    },
    acceleration: {
      type: String,
      required: true, // e.g., "2.6s" or "4.4s"
      trim: true,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one vehicle image is required",
      },
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance", "reserved", "new"],
      default: "available",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Pre-save validation or automatic slug generation can be placed here if necessary

const Car = models.Car || model<ICar>("Car", CarSchema);
export default Car;
