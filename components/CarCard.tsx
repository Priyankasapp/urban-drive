"use client";

import Image from "next/image";
import { Car } from "@/types/types";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-64 overflow-hidden md:h-72">
        <Image
          src={car.imageSrc}
          alt={car.name}
          fill
          priority={car.id === "porsche-taycan"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-medium uppercase tracking-wider text-white">
          {car.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>

            <p className="mt-1 text-sm text-gray-500">{car.tagline}</p>
          </div>

          <div className="text-right">
            <h4 className="text-2xl font-bold text-black">
              ${car.pricePerDay}
            </h4>

            <p className="text-xs uppercase tracking-widest text-gray-500">
              / Day
            </p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-3 border-t border-gray-200 pt-4">
          {car.specs.map((spec) => (
            <div key={spec.label}>
              <p className="text-[11px] uppercase tracking-widest text-gray-500">
                {spec.label}
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
