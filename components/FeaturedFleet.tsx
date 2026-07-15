"use client";

import React from "react";
import { CarCard } from "./CarCard";
import { Car } from "@/types/types";

import Car1 from "@/assets/car1.jpeg";
import Car2 from "@/assets/car1.jpg";

const fleetData: Car[] = [
  {
    id: "porsche-taycan",
    category: "Electric",
    imageSrc: Car1.src,
    name: "Porsche Taycan Turbo S",
    tagline: "Excellence in Motion",
    pricePerDay: 499,
    specs: [
      { label: "Transmission", value: "Auto" },
      { label: "Power", value: "750 HP" },
      { label: "0-60 MPH", value: "2.6s" },
    ],
  },
  {
    id: "range-rover",
    category: "Luxury SUV",
    imageSrc: Car2.src,
    name: "Range Rover Autobiography",
    tagline: "Unmatched Comfort",
    pricePerDay: 350,
    specs: [
      { label: "Transmission", value: "Auto" },
      { label: "Power", value: "523 HP" },
      { label: "Passengers", value: "5" },
    ],
  },
];

export default function FeaturedFleet() {
  return (
    <section id="fleet" className="overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 max-w-2xl">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Featured Fleet
          </span>

          <h2 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
            Precision Performance.
            <br />
            Executive Luxury.
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Explore our curated collection of world-class luxury vehicles,
            engineered for performance and crafted for comfort.
          </p>
        </div>

        {/* Cars */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {fleetData.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
