import { Schema, models, model } from "mongoose";

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

const Category =
  models.Category || model<ICategory>("Category", CategorySchema);
export default Category;
