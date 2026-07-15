"use client";

import React from "react";
import { CarCard } from "./CarCard";
import { Car } from "@/types/types";
import Car1 from "@/assets/car1.jpeg";
import CAr2 from "@/assets/car1.jpg";
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
    imageSrc: CAr2.src,
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

export default function FeaturedFleet(): React.JSX.Element {
  return (
    <section id="fleet" className="bg-surface py-32 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Section Heading */}
        <div className="mb-16">
          <h3 className="font-headline-lg text-headline-lg text-primary mb-2">
            Featured Fleet
          </h3>
          <p className="font-body-md text-body-md text-text-secondary">
            Precision performance meet executive luxury.
          </p>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {fleetData.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
