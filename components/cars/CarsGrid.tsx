"use client";

import { useMemo } from "react";
import { CarCard } from "@/components/CarCard";
import { useCars } from "@/context/CarContext";
import type { Car } from "@/types/cars";

const fallbackCars: Car[] = [
  {
    id: "porsche-taycan",
    name: "Porsche Taycan Turbo S",
    slug: "porsche-taycan-turbo-s",
    brand: "Porsche",
    category: "Electric",
    image: "/assets/car1.jpeg",
    horsepower: 750,
    acceleration: "2.6s",
    transmission: "Automatic",
    dailyPrice: 499,
    status: "available",
    specs: [
      { label: "Transmission", value: "Auto" },
      { label: "Power", value: "750 HP" },
      { label: "0-60 MPH", value: "2.6s" },
    ],
  },
  {
    id: "range-rover",
    name: "Range Rover Autobiography",
    slug: "range-rover-autobiography",
    brand: "Land Rover",
    category: "Luxury SUV",
    image: "/assets/car1.jpg",
    horsepower: 523,
    acceleration: "4.4s",
    transmission: "Automatic",
    dailyPrice: 350,
    status: "available",
    specs: [
      { label: "Transmission", value: "Auto" },
      { label: "Power", value: "523 HP" },
      { label: "Passengers", value: "5" },
    ],
  },
  {
    id: "bmw-i7",
    name: "BMW i7",
    slug: "bmw-i7",
    brand: "BMW",
    category: "Luxury",
    image: "/assets/car2.jpeg",
    horsepower: 590,
    acceleration: "4.0s",
    transmission: "Automatic",
    dailyPrice: 420,
    status: "new",
    specs: [
      { label: "Transmission", value: "Auto" },
      { label: "Power", value: "590 HP" },
      { label: "Range", value: "310 mi" },
    ],
  },
];

const CarsGrid = () => {
  const { cars: apiCars, loading, errorMsg } = useCars();

  const cars: Car[] = useMemo(() => {
    if (apiCars.length > 0) {
      return apiCars.map((car) => {
        const brandName =
          typeof car.brand === "string"
            ? car.brand
            : car.brand?.name || "Unknown";
        const categoryName =
          typeof car.category === "string"
            ? car.category
            : car.category?.name || "Luxury";
        const transmission =
          car.transmission?.toLowerCase() === "manual" ? "Manual" : "Automatic";
        const status: Car["status"] =
          car.status === "reserved" || car.status === "new"
            ? car.status
            : "available";

        return {
          id: car._id,
          name: car.name,
          slug: car.slug,
          brand: brandName,
          category: categoryName,
          image: car.images?.[0] || "/assets/car1.jpeg",
          horsepower: car.horsepower,
          acceleration: car.acceleration,
          transmission,
          dailyPrice: car.pricePerDay,
          status,
          specs: [
            { label: "Transmission", value: transmission },
            { label: "Power", value: `${car.horsepower} HP` },
            { label: "Seats", value: `${car.seats}` },
          ],
        };
      });
    }

    return fallbackCars;
  }, [apiCars]);

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Premium Collection
            </h2>

            <p className="mt-2 text-gray-600">
              {cars.length} luxury vehicles available
            </p>
          </div>

          <button className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold transition hover:border-black hover:bg-black hover:text-white">
            Reset Filters
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-8 py-16 text-center text-gray-600">
            Loading vehicles...
          </div>
        ) : errorMsg ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-8 py-16 text-center text-red-600">
            {errorMsg}
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white py-24 text-center">
            <h3 className="text-2xl font-bold text-gray-900">No Cars Found</h3>

            <p className="mt-3 max-w-md text-gray-500">
              We could not find any vehicles matching your selected filters. Try
              changing your search or resetting the filters.
            </p>

            <button className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gray-900">
              Reset Filters
            </button>
          </div>
        )}

        {cars.length > 0 && (
          <div className="mt-16 flex justify-center">
            <button className="rounded-full border border-black px-8 py-4 text-sm font-semibold uppercase tracking-wider transition hover:bg-black hover:text-white">
              Load More Vehicles
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CarsGrid;
