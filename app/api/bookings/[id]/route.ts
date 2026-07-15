import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const booking = await Booking.findById(id).populate("car");

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("GET Booking Detail Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 },
      );
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("PUT Booking Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
