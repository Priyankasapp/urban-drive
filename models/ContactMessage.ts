import { Schema, models, model } from "mongoose";

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "responded";
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["new", "read", "responded"],
      default: "new",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const ContactMessage =
  models.ContactMessage ||
  model<IContactMessage>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
