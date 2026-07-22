import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Car from "@/models/Car";
import Reservation from "@/models/Reservation";
import { connectDB } from "@/lib/db";

interface ReservationRequestBody {
  carId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  pickup: {
    location: string;
    date: string;
    time: string;
  };
  dropoff?: {
    location?: string;
    date?: string;
    time?: string;
  };
  chauffeur?: boolean;
  enhancements?: {
    conciergeDelivery?: boolean;
    platinumInsurance?: boolean;
    satelliteConnectivity?: boolean;
  };
  notes?: string;
}

// Narrow, reusable type guard instead of trusting the body blindly
function isValidReservationBody(body: unknown): body is ReservationRequestBody {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;

  if (typeof b.carId !== "string") return false;

  const customer = b.customer as Record<string, unknown> | undefined;
  if (
    typeof customer?.name !== "string" ||
    typeof customer?.email !== "string" ||
    typeof customer?.phone !== "string"
  ) {
    return false;
  }

  const pickup = b.pickup as Record<string, unknown> | undefined;
  if (
    typeof pickup?.location !== "string" ||
    typeof pickup?.date !== "string" ||
    typeof pickup?.time !== "string"
  ) {
    return false;
  }

  return true;
}

function generateReservationRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `UD-${timestamp}-${random}`;
}

function calculateRentalDays(pickupDate: Date, dropoffDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil(
    (dropoffDate.getTime() - pickupDate.getTime()) / msPerDay,
  );
  return Math.max(diff, 1);
}

// Type guard for Mongo's duplicate-key error, without using `any`
interface MongoDuplicateKeyError {
  code: number;
}
function isDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === 11000
  );
}

export async function POST(req: NextRequest) {
  try {
    // 2. Swapped placeholder hook out for your real connectDB utility
    await connectDB();

    const rawBody: unknown = await req.json();
    if (!isValidReservationBody(rawBody)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields" },
        { status: 400 },
      );
    }
    const body: ReservationRequestBody = rawBody;

    if (!mongoose.Types.ObjectId.isValid(body.carId)) {
      return NextResponse.json(
        { success: false, message: "Invalid car id" },
        { status: 400 },
      );
    }

    const car = await Car.findOne({ _id: body.carId, isDeleted: false });
    if (!car) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 },
      );
    }
    if (car.status !== "available") {
      return NextResponse.json(
        { success: false, message: "Car is not currently available" },
        { status: 409 },
      );
    }

    const pickupDate = new Date(body.pickup.date);
    const dropoffDate = body.dropoff?.date
      ? new Date(body.dropoff.date)
      : pickupDate;
    const rentalDays = calculateRentalDays(pickupDate, dropoffDate);

    const dailyRate = car.pricePerDay;
    const subtotal = dailyRate * rentalDays;
    const taxRate = 0.08;
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const reservation = await Reservation.create({
      reservationRef: generateReservationRef(),
      car: car._id,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone,
      },
      pickup: {
        location: body.pickup.location,
        date: pickupDate,
        time: body.pickup.time,
      },
      dropoff: body.dropoff
        ? {
            location: body.dropoff.location,
            date: body.dropoff.date ? new Date(body.dropoff.date) : undefined,
            time: body.dropoff.time,
          }
        : undefined,
      chauffeur: body.chauffeur ?? false,
      enhancements: {
        conciergeDelivery: body.enhancements?.conciergeDelivery ?? false,
        platinumInsurance: body.enhancements?.platinumInsurance ?? true,
        satelliteConnectivity:
          body.enhancements?.satelliteConnectivity ?? false,
      },
      pricing: { dailyRate, rentalDays, subtotal, tax, total },
      status: "pending",
      notes: body.notes,
    });

    // Match your front-end expected shape (result.reservation instead of data)
    return NextResponse.json(
      { success: true, reservation: reservation },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Reservation creation error:", error);

    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate reservation reference — please try again",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create reservation" },
      { status: 500 },
    );
  }
}

// 3. Removed the non-implemented dbConnect loop placeholder entirely
