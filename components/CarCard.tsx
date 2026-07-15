"use client";

import React from "react";
import Image from "next/image";
import { Car } from "@/types/types";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <div className="bg-white rounded-brand overflow-hidden group shadow-[0px_10px_40px_rgba(0,0,0,0.04)] m-20 border border-border flex flex-col">
      {/* Media Asset Wrapper */}
      <div className="relative h-[400px]  overflow-hidden">
        <Image
          src={car.imageSrc}
          alt={car.name}
          fill
          priority={car.id === "porsche-taycan"} // Priority loading for first fold items
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Category Tag Overlay */}
        <div className="absolute top-6 left-6 bg-black text-white px-4 py-1 rounded-full text-[12px] font-semibold tracking-wider uppercase">
          {car.category}
        </div>
      </div>

      {/* Card Content Block */}
      <div className="p-8 flex-1 flex flex-col">
        {/* Header: Name and Pricing */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="font-headline-md text-headline-md text-primary">
              {car.name}
            </h4>
            <p className="font-body-md text-text-secondary">{car.tagline}</p>
          </div>
          <div className="text-right">
            <span className="font-headline-md text-headline-md text-primary">
              ${car.pricePerDay}
            </span>
            <span className="font-label-sm text-label-sm text-text-secondary">
              / DAY
            </span>
          </div>
        </div>

        {/* Performance Specs Grid Row */}
        <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 mt-auto">
          {car.specs.map((spec, index) => (
            <div
              key={index}
              className={`flex flex-col gap-1 ${index === 2 ? "text-right" : ""}`}
            >
              <span className="font-label-sm text-[10px] text-text-secondary uppercase tracking-widest">
                {spec.label}
              </span>
              <span className="font-body-md font-semibold text-primary">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
