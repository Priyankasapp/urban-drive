"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Car from "@/assets/car4.jpeg";

export default function Hero(): React.JSX.Element {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.type = "date";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    if (!e.target.value) {
      e.target.type = "text";
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <section className="relative w-full h-[90vh] md:h-screen flex items-center overflow-hidden">
      {/* Background Image Layer with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={Car}
          alt="Premium Supercar Elite Drive"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10 dark:from-black/60 dark:via-black/20" />
      </div>

      {/* Hero Content Container */}
      <div className="relative px-20 z-10 max-w-7xl mx-auto w-full px-6 flex flex-col justify-center h-full pt-20">
        {/* Typography Block */}
        <div className="max-w-2xl text-left mb-10 select-none">
          <h1 className="text-5xl md:text-5xl font-black tracking-tight leading-[1.1] text-white">
            Elite Drive. <br />
            <span className="opacity-90">Urban Soul.</span>
          </h1>
          <p className="mt-6 text-base md:text-sm font-normal tracking-wide text-gray-300 max-w-lg leading-relaxed">
            Experience the pinnacle of automotive engineering with our curated
            fleet of ultra-luxury vehicles. Designed for those who demand
            precision and prestige.
          </p>
        </div>

        {/* Floating Quick Booking Widget */}
        <div className="glassmorphism w-full max-w-3xl p-3 md:p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[var(--border)] shadow-2xl backdrop-blur-md">
          {/* Pickup Location Selection */}
          <div className="w-full md:w-1/2 flex items-center px-4 py-2 md:py-0">
            <svg
              className="w-5 h-5 mr-3 text-gray-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="flex flex-col w-full">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Pickup Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you heading?"
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-gray-600 placeholder-gray-400 mt-0.5"
              />
            </div>
          </div>

          {/* Dates Selection */}
          <div className="w-full md:w-1/2 flex items-center px-4 py-3 md:py-0">
            <svg
              className="w-5 h-5 mr-3 text-gray-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className="flex flex-col w-full">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Dates
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Select dates"
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-gray-600 placeholder-gray-400 mt-0.5"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto md:pl-4 flex-shrink-0 pt-2 md:pt-0">
            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-md"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
