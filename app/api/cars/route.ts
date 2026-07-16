import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car, { type ICar } from "@/models/Car";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import Location from "@/models/Location";
import { Types } from "mongoose";
import fs from "fs";
import path from "path";

const transmissionOptions = [
  "Automatic",
  "Manual",
] as const satisfies readonly ICar["transmission"][];
const fuelTypeOptions = [
  "Electric (BEV)",
  "Premium Gasoline",
  "petrol",
  "diesel",
  "hybrid",
] as const satisfies readonly ICar["fuelType"][];
const statusOptions = [
  "available",
  "booked",
  "maintenance",
  "reserved",
  "new",
] as const satisfies readonly ICar["status"][];

function isOption<T extends string>(
  options: readonly T[],
  value: string,
): value is T {
  return (options as readonly string[]).includes(value);
}

async function resolveBrand(value: string) {
  if (Types.ObjectId.isValid(value)) {
    const brand = await Brand.findById(value).exec();
    if (!brand) throw new Error("Selected brand was not found.");
    return brand._id;
  }

  const existingBrand = await Brand.findOne({ name: value }).exec();
  if (existingBrand) return existingBrand._id;

  return (await Brand.create({ name: value, logo: "/assets/car1.jpeg" }))._id;
}

async function resolveCategory(value: string) {
  if (Types.ObjectId.isValid(value)) {
    const category = await Category.findById(value).exec();
    if (!category) throw new Error("Selected category was not found.");
    return category._id;
  }

  const existingCategory = await Category.findOne({ name: value }).exec();
  if (existingCategory) return existingCategory._id;

  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return (await Category.create({ name: value, slug }))._id;
}

async function resolveLocation(value: string) {
  if (Types.ObjectId.isValid(value)) {
    const location = await Location.findById(value).exec();
    if (!location) throw new Error("Selected location was not found.");
    return location._id;
  }

  const existingLocation = await Location.findOne({ name: value }).exec();
  if (existingLocation) return existingLocation._id;

  return (
    await Location.create({
      name: value,
      address: value,
      city: "Not specified",
    })
  )._id;
}

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
    const transmission = formData.get("transmission");
    const fuelType = formData.get("fuelType");
    const seats = formData.get("seats");
    const horsepower = formData.get("horsepower");
    const acceleration = formData.get("acceleration") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") || "available";

    // Basic required input check
    if (
      !name ||
      !brand ||
      !category ||
      !location ||
      !pricePerDay ||
      !horsepower ||
      !acceleration ||
      typeof transmission !== "string" ||
      typeof fuelType !== "string" ||
      typeof status !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required core fields." },
        { status: 400 },
      );
    }

    if (
      !isOption(transmissionOptions, transmission) ||
      !isOption(fuelTypeOptions, fuelType) ||
      !isOption(statusOptions, status)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid car specification." },
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

    const [brandId, categoryId, locationId] = await Promise.all([
      resolveBrand(brand),
      resolveCategory(category),
      resolveLocation(location),
    ]);

    // 5. Construct document validation block inside MongoDB
    const newCar = await Car.create({
      name,
      slug,
      brand: brandId,
      category: categoryId,
      location: locationId,
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

    // Soft-deleted cars remain in the database but must not be shown in the fleet.
    const cars = await Car.find({ isDeleted: false })
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
