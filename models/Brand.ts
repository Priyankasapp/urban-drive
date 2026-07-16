import { Schema, models, model, type Model } from "mongoose";

export interface IBrand {
  name: string;
  logo: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    logo: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Brand: Model<IBrand> =
  (models.Brand as Model<IBrand> | undefined) ??
  model<IBrand>("Brand", BrandSchema);
export default Brand;
