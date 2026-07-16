import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/db";
import Car from "@/models/Car";

// ==========================================
// 1. UPDATE VEHICLE (PUT /api/cars/[id])
// ==========================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    // 1. Keep this check to ensure the string is a valid ID pattern
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid car id" },
        { status: 400 },
      );
    }

    const isMultipartRequest = request.headers
      .get("content-type")
      ?.includes("multipart/form-data");
    const updateData: Record<string, unknown> = isMultipartRequest
      ? await getMultipartUpdateData(request)
      : await request.json();

    // Prevent direct manual manipulation of system indexes
    delete updateData._id;
    delete updateData.isDeleted;

    // Mongoose casts the validated id string to an ObjectId.
    const updatedCar = await Car.findByIdAndUpdate(
      id, // <-- Passing the raw string solves the TS2345 type mismatch
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedCar) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Car updated successfully",
      data: updatedCar,
    });
  } catch (error) {
    console.error("PUT Car Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

async function getMultipartUpdateData(
  request: NextRequest,
): Promise<Record<string, unknown>> {
  const formData = await request.formData();
  const updateData: Record<string, unknown> = {
    name: formData.get("name"),
    pricePerDay: Number(formData.get("pricePerDay")),
    transmission: formData.get("transmission"),
    fuelType: formData.get("fuelType"),
    seats: Number(formData.get("seats")),
    horsepower: Number(formData.get("horsepower")),
    acceleration: formData.get("acceleration"),
    description: formData.get("description"),
    status: formData.get("status"),
  };

  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return updateData;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  updateData.images = await Promise.all(
    files.map(async (file) => {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files can be uploaded.");
      }

      const filename = `${Date.now()}-${crypto.randomUUID()}${path.extname(file.name) || ".jpg"}`;
      await fs.promises.writeFile(
        path.join(uploadDir, filename),
        Buffer.from(await file.arrayBuffer()),
      );

      return `/uploads/${filename}`;
    }),
  );

  return updateData;
}

// ==========================================
// 2. SOFT DELETE VEHICLE (DELETE /api/cars/[id])
// ==========================================
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid car id" },
        { status: 400 },
      );
    }

    // Pass the raw 'id' string here as well!
    const car = await Car.findByIdAndUpdate(
      id, // <-- Pass raw string directly here too
      { isDeleted: true },
      { new: true },
    );

    if (!car) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Car Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
