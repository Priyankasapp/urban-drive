import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Location from "@/models/Location";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const { name, address, city } = await request.json();

    const location = await Location.findByIdAndUpdate(
      id,
      { name, address, city },
      { new: true },
    );

    if (!location) {
      return NextResponse.json({ success: false, message: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error("PUT Location Error:", error);
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

    const location = await Location.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!location) {
      return NextResponse.json({ success: false, message: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Location deleted successfully" });
  } catch (error) {
    console.error("DELETE Location Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
