import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { seedSuperAdmin } from "@/lib/seeder";

export async function GET() {
  try {
    await connectDB();

    await seedSuperAdmin();

    return NextResponse.json({
      success: true,
      message: "Setup completed",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Setup failed",
      },
      { status: 500 },
    );
  }
}
