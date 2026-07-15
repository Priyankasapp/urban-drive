import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebsiteContent extends Document {
  key: string; // e.g. "hero_title", "hero_subtitle"
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteContentSchema = new Schema<IWebsiteContent>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const WebsiteContent: Model<IWebsiteContent> =
  mongoose.models.WebsiteContent ||
  mongoose.model<IWebsiteContent>("WebsiteContent", WebsiteContentSchema);
export default WebsiteContent;
