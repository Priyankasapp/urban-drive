import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isDeleted: false }).sort({ name: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const existingCategory = await Category.findOne({ slug, isDeleted: false });
    if (existingCategory) {
      return NextResponse.json({ success: false, message: "Category already exists" }, { status: 400 });
    }

    const newCategory = await Category.create({ name, slug });
    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
