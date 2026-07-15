import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/models/Car";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import Location from "@/models/Location";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const car = await Car.findOne({ _id: id, isDeleted: false })
      .populate("brand")
      .populate("category")
      .populate("location");

    if (!car) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, car });
  } catch (error) {
    console.error("GET Car Detail Error:", error);
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

    // Lookup category if passed as a name
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

    const updatedData: any = {
      name: data.name,
      pricePerDay: Number(data.pricePerDay),
      transmission: data.transmission,
      fuelType: data.fuelType,
      seats: Number(data.seats),
      description: data.description,
      status: data.status,
    };

    if (brandId) updatedData.brand = brandId;
    if (categoryId) updatedData.category = categoryId;
    if (locationId) updatedData.location = locationId;
    if (data.images) {
      updatedData.images = Array.isArray(data.images) ? data.images : [data.images];
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedCar) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, car: updatedCar });
  } catch (error) {
    console.error("PUT Car Error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const car = await Car.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!car) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("DELETE Car Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
