import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
      status: "new",
    });

    return NextResponse.json({ success: true, message: "Message sent successfully!", newMessage });
  } catch (error) {
    console.error("POST Contact Message Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
