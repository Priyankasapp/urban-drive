import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const { name, logo } = await request.json();

    const brand = await Brand.findByIdAndUpdate(
      id,
      { name, logo },
      { new: true },
    );

    if (!brand) {
      return NextResponse.json({ success: false, message: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, brand });
  } catch (error) {
    console.error("PUT Brand Error:", error);
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

    const brand = await Brand.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!brand) {
      return NextResponse.json({ success: false, message: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    console.error("DELETE Brand Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
