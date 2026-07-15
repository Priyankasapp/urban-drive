import bcrypt from "bcryptjs";
import User from "@/models/User";
import Role from "@/models/Role";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import Location from "@/models/Location";
import Car from "@/models/Car";

export async function seedSuperAdmin() {
  try {
    // 1. Seed Roles first
    const rolesToSeed = [
      { name: "super_admin", permissions: ["*"] },
      {
        name: "admin",
        permissions: [
          "cars:read",
          "cars:write",
          "bookings:create",
          "bookings:read_own",
          "bookings:read_all",
          "bookings:manage",
          "reports:view",
          "users:manage",
        ],
      },
      {
        name: "manager",
        permissions: ["cars:read", "cars:write", "bookings:read_all", "bookings:manage"],
      },
      { name: "customer", permissions: ["cars:read", "bookings:create", "bookings:read_own"] },
    ];

    const seededRoles: Record<string, any> = {};

    for (const r of rolesToSeed) {
      let roleDoc = await Role.findOne({ name: r.name });
      if (!roleDoc) {
        roleDoc = await Role.create(r);
        console.log(`🔑 Role '${r.name}' seeded.`);
      }
      seededRoles[r.name] = roleDoc;
    }

    // 2. Seed Super Admin User
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL ?? "superadmin@urbandrive.com";
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "securepass123";
    const superAdminName = process.env.SUPER_ADMIN_NAME ?? "UrbanDrive Master";

    const existingSuperAdmin = await User.findOne({ email: superAdminEmail });

    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
      await User.create({
        name: superAdminName,
        email: superAdminEmail,
        phone: "+1 (555) 019-9999",
        password: hashedPassword,
        role: seededRoles["super_admin"]._id,
        permissions: ["*"],
        isActive: true,
        isEmailVerified: true,
      });
      console.log("✨ Super Admin User Created Successfully");
    } else {
      console.log("Super Admin User already exists.");
    }

    // 3. Seed Categories
    const categoriesToSeed = [
      { name: "Sports", slug: "sports" },
      { name: "SUV", slug: "suv" },
      { name: "Electric", slug: "electric" },
      { name: "Vintage", slug: "vintage" },
    ];

    const seededCategories: Record<string, any> = {};
    for (const c of categoriesToSeed) {
      let cat = await Category.findOne({ slug: c.slug });
      if (!cat) {
        cat = await Category.create(c);
        console.log(`🚗 Category '${c.name}' seeded.`);
      }
      seededCategories[c.slug] = cat;
    }

    // 4. Seed Brands
    const brandsToSeed = [
      {
        name: "Porsche",
        logo: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=200",
      },
      {
        name: "Range Rover",
        logo: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200",
      },
      {
        name: "Toyota",
        logo: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200",
      },
      {
        name: "Ford",
        logo: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=200",
      },
    ];

    const seededBrands: Record<string, any> = {};
    for (const b of brandsToSeed) {
      let brandDoc = await Brand.findOne({ name: b.name });
      if (!brandDoc) {
        brandDoc = await Brand.create(b);
        console.log(`🏷️ Brand '${b.name}' seeded.`);
      }
      seededBrands[b.name.toLowerCase().replace(/\s+/g, "-")] = brandDoc;
    }

    // 5. Seed Locations
    const locationsToSeed = [
      { name: "LAX Airport Terminal 1", address: "1 World Way", city: "Los Angeles" },
      { name: "JFK Airport Terminal 4", address: "JFK Access Road", city: "New York" },
      { name: "SFO Airport Terminal G", address: "SFO Access Road", city: "San Francisco" },
    ];

    const seededLocations: Record<string, any> = {};
    for (const l of locationsToSeed) {
      let loc = await Location.findOne({ name: l.name });
      if (!loc) {
        loc = await Location.create(l);
        console.log(`📍 Location '${l.name}' seeded.`);
      }
      seededLocations[l.city.toLowerCase().replace(/\s+/g, "-")] = loc;
    }

    // 6. Seed Cars
    const carsToSeed = [
      {
        name: "Porsche Taycan Turbo S",
        slug: "porsche-taycan-turbo-s",
        brand: seededBrands["porsche"]._id,
        category: seededCategories["electric"]._id,
        location: seededLocations["los-angeles"]._id,
        pricePerDay: 499,
        transmission: "automatic",
        fuelType: "electric",
        seats: 4,
        images: ["/assets/car1.jpeg"],
        description: "Experience the pinnacle of electric performance with the Porsche Taycan Turbo S.",
        status: "available",
      },
      {
        name: "Range Rover Autobiography",
        slug: "range-rover-autobiography",
        brand: seededBrands["range-rover"]._id,
        category: seededCategories["suv"]._id,
        location: seededLocations["los-angeles"]._id,
        pricePerDay: 350,
        transmission: "automatic",
        fuelType: "diesel",
        seats: 5,
        images: ["/assets/car1.jpg"],
        description: "Indulge in absolute luxury and unmatched comfort on any terrain.",
        status: "available",
      },
      {
        name: "Toyota Camry Executive",
        slug: "toyota-camry-executive",
        brand: seededBrands["toyota"]._id,
        category: seededCategories["sports"]._id,
        location: seededLocations["new-york"]._id,
        pricePerDay: 45,
        transmission: "automatic",
        fuelType: "hybrid",
        seats: 5,
        images: ["/assets/car2.jpeg"],
        description: "Reliable, comfortable, and highly fuel-efficient corporate transport.",
        status: "available",
      },
    ];

    for (const c of carsToSeed) {
      const existingCar = await Car.findOne({ slug: c.slug });
      if (!existingCar) {
        await Car.create(c);
        console.log(`🚘 Car '${c.name}' seeded.`);
      }
    }

    console.log("🌱 Database Seeding Completed Successfully.");
  } catch (error) {
    console.error("❌ Seeder Error:", error);
  }
}
