import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/models/Car";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import Location from "@/models/Location";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";

    const query: any = { isDeleted: false };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        query.category = catDoc._id;
      } else if (category.length === 24) {
        query.category = category;
      } else {
        return NextResponse.json({ success: true, cars: [] });
      }
    }

    if (status && status !== "all") {
      query.status = status.toLowerCase();
    }

    const cars = await Car.find(query)
      .populate("brand")
      .populate("category")
      .populate("location")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, cars });
  } catch (error) {
    console.error("GET Cars Error:", error);
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

    let brandId = data.brand;
    let categoryId = data.category;
    let locationId = data.location;

    // Lookup brand if passed as a name
    if (typeof brandId === "string" && brandId.length !== 24) {
      let b = await Brand.findOne({ name: { $regex: `^${brandId}$`, $options: "i" } });
      if (!b) {
        b = await Brand.create({ name: brandId, logo: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=200" });
      }
      brandId = b._id;
    }

    // Lookup category if passed as a name or slug
    if (typeof categoryId === "string" && categoryId.length !== 24) {
      let c = await Category.findOne({ slug: categoryId.toLowerCase() });
      if (!c) {
        c = await Category.findOne({ name: { $regex: `^${categoryId}$`, $options: "i" } });
      }
      if (!c) {
        c = await Category.create({ name: categoryId, slug: categoryId.toLowerCase().replace(/\s+/g, "-") });
      }
      categoryId = c._id;
    }

    // Lookup location if passed as a name
    if (typeof locationId === "string" && locationId.length !== 24) {
      let l = await Location.findOne({ name: { $regex: `^${locationId}$`, $options: "i" } });
      if (!l) {
        l = await Location.create({ name: locationId, address: locationId, city: "Default" });
      }
      locationId = l._id;
    }

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const newCar = await Car.create({
      name: data.name,
      slug,
      brand: brandId,
      category: categoryId,
      location: locationId,
      pricePerDay: Number(data.pricePerDay),
      transmission: data.transmission,
      fuelType: data.fuelType,
      seats: Number(data.seats),
      images: Array.isArray(data.images) ? data.images : [data.images || "/assets/car1.jpeg"],
      description: data.description,
      status: data.status || "available",
    });

    return NextResponse.json({ success: true, car: newCar });
  } catch (error) {
    console.error("POST Car Error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 400 },
    );
  }
}
