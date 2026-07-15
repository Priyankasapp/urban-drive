import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";

export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find({ isDeleted: false }).sort({ name: 1 });
    return NextResponse.json({ success: true, brands });
  } catch (error) {
    console.error("GET Brands Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, logo } = await request.json();

    if (!name) {
      return NextResponse.json({ success: false, message: "Brand name is required" }, { status: 400 });
    }

    const existingBrand = await Brand.findOne({ name, isDeleted: false });
    if (existingBrand) {
      return NextResponse.json({ success: false, message: "Brand already exists" }, { status: 400 });
    }

    const newBrand = await Brand.create({
      name,
      logo: logo || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=200",
    });

    return NextResponse.json({ success: true, brand: newBrand });
  } catch (error) {
    console.error("POST Brand Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
