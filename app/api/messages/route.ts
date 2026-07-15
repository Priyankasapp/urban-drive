import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function GET() {
  try {
    await connectDB();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("GET Contact Messages Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
