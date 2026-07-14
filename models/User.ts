import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  role: "super_admin" | "college_admin" | "teacher" | "student";

  collegeId?: Types.ObjectId;

  permissions: string[];

  enrollmentNo?: string;
  department?: string;
  semester?: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["super_admin", "college_admin", "teacher", "student"],
      required: true,
    },

    collegeId: {
      type: Schema.Types.ObjectId,
      ref: "College",
      default: null,
    },

    permissions: {
      type: [String],
      default: [],
    },

    enrollmentNo: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    semester: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
