import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Defines the user roles available in the car rental ecosystem.
 */
export enum UserRole {
  SUPER_ADMIN = "super_admin", // Full system override, billing, platform management
  ADMIN = "admin", // Full system access, manages staff, financial data, and overrides
  FLEET_MANAGER = "manager", // Can add/edit cars, manage maintenance status
  CUSTOMER = "customer", // Can browse cars, create bookings, manage own profile
}

/**
 * Fine-grained application capabilities.
 * Add new permissions here as your system expands.
 */
export type Permission =
  | "cars:read"
  | "cars:write"
  | "bookings:create"
  | "bookings:read_own"
  | "bookings:read_all"
  | "bookings:manage" // Cancel, approve, complete any booking
  | "reports:view" // Revenue, analytics
  | "users:manage"; // Manage staff accounts

/**
 * Role-to-Permission mapping matrix.
 */
export const RolePermissions: Record<UserRole, Permission[] | string[]> = {
  [UserRole.SUPER_ADMIN]: ["*"],
  [UserRole.ADMIN]: [
    "cars:read",
    "cars:write",
    "bookings:create",
    "bookings:read_own",
    "bookings:read_all",
    "bookings:manage",
    "reports:view",
    "users:manage",
  ],
  [UserRole.FLEET_MANAGER]: [
    "cars:read",
    "cars:write",
    "bookings:read_all",
    "bookings:manage",
  ],
  [UserRole.CUSTOMER]: ["cars:read", "bookings:create", "bookings:read_own"],
};

/**
 * Helper utility to verify if a specific role possesses a required permission.
 * Useful for Express middlewares or Next.js route handlers.
 *
 * @example hasPermission(user.role, "cars:write")
 */
export function hasPermission(
  role: UserRole | string,
  permission: Permission,
): boolean {
  const permissions = RolePermissions[role as UserRole];
  if (!permissions) return false;
  if (permissions.includes("*")) return true;
  return (permissions as Permission[]).includes(permission);
}

export interface IRole extends Document {
  name: string; // e.g. "super_admin", "admin", "manager", "customer"
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Role: Model<IRole> =
  mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);

export default Role;

