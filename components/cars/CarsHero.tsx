"use client";

import { carsHero } from "@/data/cars";

const CarsHero = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-36 pb-24 lg:pt-44 lg:pb-32">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-gray-100 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gray-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Badge */}
        <span className="inline-block rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-600">
          {carsHero.badge}
        </span>

        {/* Heading */}
        <h1 className="mt-8 max-w-4xl text-5xl font-black leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
          {carsHero.title}
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          {carsHero.subtitle}
        </p>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 gap-8 border-t border-gray-200 pt-10 md:grid-cols-4">
          <div>
            <h3 className="text-3xl font-bold text-black">120+</h3>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray-500">
              Premium Cars
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-black">18</h3>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray-500">
              Luxury Brands
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-black">24/7</h3>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray-500">
              Concierge
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-black">100%</h3>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray-500">
              Maintained
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarsHero;
