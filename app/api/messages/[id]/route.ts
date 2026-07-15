import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !["new", "read", "responded"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const messageDoc = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!messageDoc) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: messageDoc });
  } catch (error) {
    console.error("PUT Contact Message Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const messageDoc = await ContactMessage.findByIdAndDelete(id);

    if (!messageDoc) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("DELETE Contact Message Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
