import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function seedSuperAdmin() {
  try {
    const existingSuperAdmin = await User.findOne({
      role: "super_admin",
    });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists.");
      return;
    }

    // const superAdminName = process.env.SUPER_ADMIN_NAME ?? "Super Admin";
    const superAdminEmail =
      process.env.SUPER_ADMIN_EMAIL ?? "superadmin@example.com";
    const superAdminPassword =
      process.env.SUPER_ADMIN_PASSWORD ?? "superadmin123";

    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    await User.create({
      // name: superAdminName,
      email: superAdminEmail,
      password: hashedPassword,
      role: "super_admin",
      permissions: ["*"],
      isActive: true,
    });

    console.log("✨ Super Admin Created Successfully");
  } catch (error) {
    console.error("❌ Seeder Error:", error);
  }
}
