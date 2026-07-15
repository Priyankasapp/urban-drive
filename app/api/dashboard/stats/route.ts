import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/models/Car";
import Booking from "@/models/Booking";
import ContactMessage from "@/models/ContactMessage";

export async function GET() {
  try {
    await connectDB();

    const [totalCars, activeBookings, pendingRequests, newMessages, recentBookings] =
      await Promise.all([
        Car.countDocuments({ isDeleted: false }),
        Booking.countDocuments({ status: "confirmed" }),
        Booking.countDocuments({ status: "pending" }),
        ContactMessage.countDocuments({ status: "new" }),
        Booking.find().sort({ createdAt: -1 }).limit(5),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalCars,
        activeBookings,
        pendingRequests,
        newMessages,
      },
      recentBookings: recentBookings.map((b) => ({
        id: b._id.toString(),
        bookingRef: b.bookingRef,
        carName: b.carSnapshot?.name || "Unknown Car",
        customerName: b.customerName,
        pickupDate: b.pickupDate.toISOString().split("T")[0],
        returnDate: b.returnDate.toISOString().split("T")[0],
        totalPrice: b.totalPrice,
        status: b.status,
      })),
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
