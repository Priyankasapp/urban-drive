import { Schema, models, model, type Model } from "mongoose";

export interface ILocation {
  name: string;
  address: string;
  city: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Location: Model<ILocation> =
  (models.Location as Model<ILocation> | undefined) ??
  model<ILocation>("Location", LocationSchema);
export default Location;
