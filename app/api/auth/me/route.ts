import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import "@/models/Role";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const user = await User.findById(decoded.id).populate("role");

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "User not found or disabled" },
        { status: 401 },
      );
    }

    const roleObj = user.role as any;
    const userRole = roleObj?.name || "";

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: userRole,
        permissions: user.permissions || [],
      },
    });
  } catch (error) {
    console.error("Auth Me Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
