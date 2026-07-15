import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import User from "@/models/User";
import "@/models/Role"; // Ensure Role schema is registered in Mongoose

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    // Find user and populate role
    const user = await User.findOne({ email }).populate("role");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account has been disabled.",
        },
        { status: 403 },
      );
    }

    // Resolve role name
    const roleObj = user.role as any;
    const userRole = roleObj?.name || "";

    // Allow super_admin, admin, and manager to log in
    const allowedRoles = ["super_admin", "admin", "manager"];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Unauthorized role.",
        },
        { status: 403 },
      );
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    // Generate JWT
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: userRole,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id.toString(),
          name: user.name,
          role: userRole,
        },
      },
      { status: 200 },
    );

    // Set HTTP-only cookie
    response.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
