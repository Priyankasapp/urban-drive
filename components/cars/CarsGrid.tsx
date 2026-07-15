"use client";

import { cars } from "@/data/cars";
import { CarCard } from "@/components/CarCard";

const CarsGrid = () => {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Top */}
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

        {/* Grid */}
        {cars.length > 0 ? (
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

        {/* Load More */}
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
