/**
 * Defines the user roles available in the car rental ecosystem.
 */
export enum UserRole {
  CUSTOMER = "customer", // Can browse cars, create bookings, manage own profile
  FLEET_MANAGER = "manager", // Can add/edit cars, manage maintenance status
  ADMIN = "admin", // Full system access, manages staff, financial data, and overrides
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
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.CUSTOMER]: ["cars:read", "bookings:create", "bookings:read_own"],
  [UserRole.FLEET_MANAGER]: [
    "cars:read",
    "cars:write",
    "bookings:read_all",
    "bookings:manage",
  ],
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
  return permissions.includes(permission);
}
