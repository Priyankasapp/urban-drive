import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  taxRate: number; // percentage, e.g. 8 for 8%
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: "UrbanDrive" },
    contactEmail: { type: String, default: "support@urbandrive.com" },
    contactPhone: { type: String, default: "+1 (555) 019-2834" },
    address: { type: String, default: "100 Century Blvd, Los Angeles, CA 90045" },
    currency: { type: String, default: "USD" },
    taxRate: { type: Number, default: 8.5 },
  },
  {
    timestamps: true,
  },
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
export default Settings;
