"use client";

import React from "react";
import Car1 from "@/assets/car1.jpeg";
import Car2 from "@/assets/car1.jpg";
import Car3 from "@/assets/car2.jpeg";
import { CarCard } from "./CarCard";
import { Car } from "@/types/cars";

// Explicitly typing it as Car[] ensures it strictly adheres to your interface
const fleetData: Car[] = [
  {
    id: "porsche-taycans",
    name: "Porsche Taycan Turbo S",
    slug: "porsche-taycan-turbo-s",
    brand: "Porsche",
    category: "Electric",
    // Next.js static asset imports expose a .src string containing the final URL path
    image: Car1.src,
    horsepower: 750,
    acceleration: "2.6s",
    transmission: "Automatic", // Must match "Automatic" or "Manual" precisely
    dailyPrice: 499,
    status: "available", // Must match "available" | "reserved" | "new"
    specs: [
      { label: "Transmission", value: "Auto" },
      { label: "Power", value: "750 HP" },
      { label: "0-60 MPH", value: "2.6s" },
    ],
  },
  {
    id: "range-rovesr",
    name: "Range Rover Autobiography",
    slug: "range-rover-autobiography",
    brand: "Land Rover",
    category: "Luxury SUV",
    image: Car2.src,
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
    id: "range-rosver",
    name: "Range Rover Autobiography",
    slug: "range-rover-autobiography",
    brand: "Land Rover",
    category: "Luxury SUV",
    image: Car3.src,
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
];

export default function FeaturedFleet() {
  return (
    <section id="fleet" className="overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 max-w-2xl">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {fleetData.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
