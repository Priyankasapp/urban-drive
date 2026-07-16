import { Schema, models, model, type Model } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Category: Model<ICategory> =
  (models.Category as Model<ICategory> | undefined) ??
  model<ICategory>("Category", CategorySchema);
export default Category;
