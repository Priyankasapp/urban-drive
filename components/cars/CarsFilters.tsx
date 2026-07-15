"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { brands, categories, transmissions } from "@/data/cars";

const CarsFilters = () => {
  return (
    <section className="sticky top-20 z-30 border-y border-gray-200 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 lg:px-8">
        {/* Top Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by brand or model..."
              className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 outline-none transition-all focus:border-black"
            />
          </div>

          {/* Sort */}
          <select className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm outline-none focus:border-black">
            <option>Sort by</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
            <option>Performance</option>
          </select>

          {/* Mobile Filter */}
          <button className="flex items-center justify-center gap-2 rounded-full border border-black bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 lg:hidden">
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {/* Brand Chips */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Brands
          </p>

          <div className="flex flex-wrap gap-3">
            {brands.map((brand) => (
              <button
                key={brand.value}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm transition-all hover:border-black hover:bg-black hover:text-white"
              >
                {brand.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Chips */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Categories
          </p>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm transition-all hover:border-black hover:bg-black hover:text-white"
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Transmission
          </p>

          <div className="flex flex-wrap gap-3">
            {transmissions.map((item) => (
              <button
                key={item.value}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm transition-all hover:border-black hover:bg-black hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarsFilters;
