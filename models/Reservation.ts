import { Schema, models, model, Types, Document } from "mongoose";

export interface IReservation extends Document {
  reservationRef: string;
  car: Types.ObjectId;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  pickup: {
    location: string;
    date: Date;
    time: string;
  };
  dropoff?: {
    location?: string;
    date?: Date;
    time?: string;
  };
  chauffeur: boolean;
  enhancements: {
    conciergeDelivery: boolean;
    platinumInsurance: boolean;
    satelliteConnectivity: boolean;
  };
  pricing: {
    dailyRate: number;
    rentalDays: number;
    subtotal: number;
    tax: number;
    total: number;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    reservationRef: {
      type: String,
      required: true,
      unique: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
    },
    pickup: {
      location: { type: String, required: true },
      date: { type: Date, required: true },
      time: { type: String, required: true },
    },
    dropoff: {
      location: { type: String },
      date: { type: Date },
      time: { type: String },
    },
    chauffeur: {
      type: Boolean,
      default: false,
    },
    enhancements: {
      conciergeDelivery: { type: Boolean, default: false },
      platinumInsurance: { type: Boolean, default: true },
      satelliteConnectivity: { type: Boolean, default: false },
    },
    pricing: {
      dailyRate: { type: Number, required: true, min: 0 },
      rentalDays: { type: Number, required: true, min: 1 },
      subtotal: { type: Number, required: true, min: 0 },
      tax: { type: Number, required: true, min: 0 },
      total: { type: Number, required: true, min: 0 },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

ReservationSchema.index({ car: 1, "pickup.date": 1 });
ReservationSchema.index({ "customer.email": 1 });
ReservationSchema.index({ reservationRef: 1 });

// ============ MODEL EXPORT ============
const Reservation =
  models.Reservation || model<IReservation>("Reservation", ReservationSchema);
export default Reservation;
