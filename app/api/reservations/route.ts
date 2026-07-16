import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import Car from "@/models/Car";
import { Types } from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const {
      carId,
      customer,
      pickup,
      dropoff,
      chauffeur,
      enhancements,
      pricing,
      notes,
    } = data;

    // Validation
    if (!carId || !customer || !pickup || !pricing) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!customer.name || !customer.email || !customer.phone) {
      return NextResponse.json(
        { success: false, message: "Invalid customer information" },
        { status: 400 },
      );
    }

    if (!pickup.location || !pickup.date || !pickup.time) {
      return NextResponse.json(
        { success: false, message: "Invalid pickup information" },
        { status: 400 },
      );
    }

    // Verify car exists
    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 },
      );
    }

    // Generate unique reference
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const reservationRef = `RES-${timestamp}-${random}`;

    const reservation = await Reservation.create({
      reservationRef,
      car: new Types.ObjectId(carId),
      customer,
      pickup,
      dropoff,
      chauffeur: chauffeur || false,
      enhancements: enhancements || {
        conciergeDelivery: false,
        platinumInsurance: true,
        satelliteConnectivity: false,
      },
      pricing,
      notes,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error("POST Reservation Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create reservation",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const carId = searchParams.get("carId");

    const query: any = {};

    if (email) {
      query["customer.email"] = email;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (carId) {
      query.car = new Types.ObjectId(carId);
    }

    const reservations = await Reservation.find(query)
      .populate("car")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error("GET Reservations Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reservations",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
