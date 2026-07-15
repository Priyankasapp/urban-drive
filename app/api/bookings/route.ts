import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Car from "@/models/Car";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    const query: any = {};

    if (search) {
      query.$or = [
        { bookingRef: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("car")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("GET Bookings Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const {
      carId,
      customerName,
      customerEmail,
      customerPhone,
      licenseNumber,
      pickupDate,
      returnDate,
    } = data;

    if (
      !carId ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !licenseNumber ||
      !pickupDate ||
      !returnDate
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    const carDoc = await Car.findById(carId);
    if (!carDoc || carDoc.isDeleted) {
      return NextResponse.json(
        { success: false, message: "Selected car is not available" },
        { status: 404 },
      );
    }

    // Calculate days and total price
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) {
      return NextResponse.json(
        { success: false, message: "Return date must be after pickup date" },
        { status: 400 },
      );
    }
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * carDoc.pricePerDay;

    // Generate unique bookingRef
    const bookingRef = `UD-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking = await Booking.create({
      bookingRef,
      car: carDoc._id,
      carSnapshot: {
        name: carDoc.name,
        pricePerDay: carDoc.pricePerDay,
        image: carDoc.images[0] || "/assets/car1.jpeg",
      },
      customerName,
      customerEmail,
      customerPhone,
      licenseNumber,
      pickupDate: start,
      returnDate: end,
      totalPrice,
      status: "pending",
    });

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("POST Booking Error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 400 },
    );
  }
}
