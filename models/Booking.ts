import { Schema, models, model, Types, Document } from "mongoose";

interface ICarSnapshot {
  name: string;
  pricePerDay: number;
  image: string;
}

export interface IBooking {
  bookingRef: string;
  car: Types.ObjectId;
  carSnapshot: ICarSnapshot;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  licenseNumber: string;
  pickupDate: Date;
  returnDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

// Combine your interface with Mongoose's Document type for proper 'this' typing
type BookingDocument = IBooking & Document;

const CarSnapshotSchema = new Schema<ICarSnapshot>(
  {
    name: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { _id: false },
);

const BookingSchema = new Schema<IBooking>(
  {
    bookingRef: { type: String, required: true, unique: true },
    car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    carSnapshot: { type: CarSnapshotSchema, required: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    customerPhone: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, trim: true },
    pickupDate: { type: Date, required: true },
    returnDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          // Cast internally to your interface. TypeScript allows this,
          // and the ESLint rule only hates explicit 'any'.
          const doc = this as unknown as IBooking;

          // If it's running in a query context where pickupDate doesn't exist, skip safely
          if (!doc || !doc.pickupDate) return true;

          return value > doc.pickupDate;
        },
        message: "Return date must be after pickup date",
      },
    },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

BookingSchema.index({ car: 1, pickupDate: 1, returnDate: 1 });

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);
export default Booking;
