import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/models/Car";
import { Types } from "mongoose";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // 1. Read incoming body as multi-part form data instead of JSON text
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const category = formData.get("category") as string;
    const location = formData.get("location") as string;
    const pricePerDay = formData.get("pricePerDay");
    const transmission = formData.get("transmission") as string;
    const fuelType = formData.get("fuelType") as string;
    const seats = formData.get("seats");
    const horsepower = formData.get("horsepower");
    const acceleration = formData.get("acceleration") as string;
    const description = formData.get("description") as string;
    const status = (formData.get("status") as string) || "available";

    // Basic required input check
    if (!name || !pricePerDay || !horsepower || !acceleration) {
      return NextResponse.json(
        { success: false, message: "Missing required core fields." },
        { status: 400 },
      );
    }

    // 2. Establish and verify the file upload directory target
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 3. Process image file binary streams out of the multi-part array keys
    const files = formData.getAll("images") as File[];
    const savedImageUrls: string[] = [];

    for (const file of files) {
      if (file && file.size > 0) {
        // Generate a highly distinct filename to avoid collisions
        const uniqueFilename = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}${path.extname(file.name || ".jpg")}`;

        const filePath = path.join(uploadDir, uniqueFilename);

        // Convert File streaming node to native Buffer data arrays
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Synchronously save raw binary output data onto server storage disk
        fs.writeFileSync(filePath, fileBuffer);

        // Storable web path pointing to the file asset inside NextJS local scope
        savedImageUrls.push(`/uploads/${uniqueFilename}`);
      }
    }

    // Fallback if no valid images were dropped
    if (savedImageUrls.length === 0) {
      savedImageUrls.push("/assets/car1.jpeg");
    }

    // 4. Generate unique dynamic path slug string
    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    // 5. Construct document validation block inside MongoDB
    const newCar = await Car.create({
      name,
      slug,
      brand: Types.ObjectId.isValid(brand)
        ? new Types.ObjectId(brand)
        : new Types.ObjectId(),
      category: Types.ObjectId.isValid(category)
        ? new Types.ObjectId(category)
        : new Types.ObjectId(),
      location: Types.ObjectId.isValid(location)
        ? new Types.ObjectId(location)
        : new Types.ObjectId(),
      pricePerDay: Number(pricePerDay),
      transmission,
      fuelType,
      seats: Number(seats),
      horsepower: Number(horsepower),
      acceleration,
      images: savedImageUrls, // Stores the clean static folder array strings
      description,
      status,
    });

    return NextResponse.json({ success: true, car: newCar });
  } catch (error) {
    console.error("POST File Stream Car Error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    // Adding .exec() at the end gives TypeScript the standard clean array it expects
    const cars = await Car.find()
      .populate("brand")
      .populate("category")
      .populate("location")
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    console.error("GET Cars API Pipeline Failure:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve fleet records.",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
