import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Location from "@/models/Location";

export async function GET() {
  try {
    await connectDB();
    const locations = await Location.find({ isDeleted: false }).sort({ city: 1, name: 1 });
    return NextResponse.json({ success: true, locations });
  } catch (error) {
    console.error("GET Locations Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, address, city } = await request.json();

    if (!name || !address || !city) {
      return NextResponse.json({ success: false, message: "Name, address, and city are required" }, { status: 400 });
    }

    const existingLoc = await Location.findOne({ name, city, isDeleted: false });
    if (existingLoc) {
      return NextResponse.json({ success: false, message: "Location already exists" }, { status: 400 });
    }

    const newLoc = await Location.create({ name, address, city });
    return NextResponse.json({ success: true, location: newLoc });
  } catch (error) {
    console.error("POST Location Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
