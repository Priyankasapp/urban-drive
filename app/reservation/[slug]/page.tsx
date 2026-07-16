"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCars } from "@/context/CarContext";

export default function ReservationPage() {
  const params = useParams();
  const router = useRouter();
  const { cars: apiCars } = useCars();

  // --- Form & Booking States ---
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [hasChauffeur, setHasChauffeur] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [hasSatellite, setHasSatellite] = useState(false);

  // --- Guest Contact Information States ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // --- Find Vehicle ---
  const car = useMemo(() => {
    const slug = params?.slug as string | undefined;
    return apiCars.find((item) => item.slug === slug) ?? null;
  }, [apiCars, params?.slug]);

  // --- Live Dynamic Math Calculations ---
  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 1; // Default fallback metric
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return days > 0 ? days : 1;
  }, [pickupDate, returnDate]);

  const pricingCalculations = useMemo(() => {
    if (!car) return { baseRate: 0, subtotal: 0, addOns: 0, tax: 0, total: 0 };

    // Fallback safely if context specifies standard daily price parameter mapping
    const dailyRate =
      "pricePerDay" in car
        ? (car as { pricePerDay: number }).pricePerDay
        : "dailyPrice" in car
          ? (car as { dailyPrice: number }).dailyPrice
          : 0;
    const baseRate = dailyRate * rentalDays;

    let addOns = 0;
    if (hasChauffeur) addOns += 100 * rentalDays; // Custom mock rate configuration
    if (hasDelivery) addOns += 150;
    if (hasSatellite) addOns += 45 * rentalDays;

    const subtotal = baseRate + addOns;
    const tax = subtotal * 0.12; // Standard 12% calculation matrix
    const total = subtotal + tax;

    return { dailyRate, baseRate, addOns, tax, total };
  }, [car, rentalDays, hasChauffeur, hasDelivery, hasSatellite]);

  if (!car) {
    return (
      <main className="min-h-screen bg-[#f9f9f9] px-6 py-20 text-center text-gray-700">
        <h1 className="text-3xl font-semibold">Vehicle not found</h1>
        <p className="mt-3 text-gray-500">
          Please return to the fleet and choose a vehicle.
        </p>
        <Link
          href="/cars"
          className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
        >
          Back to Fleet
        </Link>
      </main>
    );
  }

  const image = car.images?.[0] || "/assets/car1.jpeg";
  const categoryName =
    typeof car.category === "string"
      ? car.category
      : car.category?.name || "Vehicle";

  // --- Handle Guest Form Formulations ---
  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fullName ||
      !email ||
      !phone ||
      !pickupLocation ||
      !pickupDate ||
      !returnDate
    ) {
      alert("Please complete all fields to secure your reservation.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const reservationPayload = {
      carId:
        (car as { _id?: string })._id ||
        (car as { id?: string }).id ||
        "unknown",
      customer: {
        name: fullName,
        email,
        phone,
      },
      pickup: {
        location: pickupLocation,
        date: new Date(pickupDate),
        time: pickupTime || "10:00",
      },
      dropoff: {
        location: pickupLocation,
        date: new Date(returnDate),
        time: "10:00",
      },
      chauffeur: hasChauffeur,
      enhancements: {
        conciergeDelivery: hasDelivery,
        platinumInsurance: true,
        satelliteConnectivity: hasSatellite,
      },
      pricing: {
        dailyRate: pricingCalculations.dailyRate,
        rentalDays,
        subtotal: pricingCalculations.baseRate + pricingCalculations.addOns,
        tax: pricingCalculations.tax,
        total: pricingCalculations.total,
      },
    };

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationPayload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create reservation");
      }

      setSuccessMessage(
        `Success! Your reservation ${result.reservation.reservationRef} has been confirmed. Check your email for details.`,
      );
      setTimeout(() => {
        router.push("/cars");
      }, 2000);
    } catch (error) {
      console.error("Reservation error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create reservation. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#111111]">
      <header className="sticky top-0 z-50 border-b border-[#E5E5E5] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link
            href="/cars"
            className="text-2xl font-bold tracking-tight text-black"
          >
            UrbanDrive
          </Link>
          <button
            type="submit"
            form="guest-checkout-form"
            disabled={isSubmitting}
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-80 disabled:opacity-50"
          >
            {isSubmitting ? "Processing" : "Book Now"}
          </button>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl flex-col lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Side: Vehicle Details Display */}
        <aside className="relative overflow-hidden border-b border-[#E5E5E5] bg-[#f3f3f3] lg:border-b-0 lg:border-r">
          <div className="absolute inset-0">
            <Image
              src={image}
              alt={car.name}
              fill
              className="object-cover grayscale brightness-90"
              priority
            />
          </div>
          <div className="relative flex h-full min-h-90 flex-col justify-end bg-linear-to-t from-black/70 to-transparent p-6 sm:p-10 lg:p-12">
            <div className="max-w-xl rounded-3xl border border-white/10 bg-white/10 p-8 text-white backdrop-blur-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c6c6c6]">
                Selected Vehicle
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                {car.name}
              </h1>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c6c6c6]">
                    Power
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {car.horsepower || "N/A"} HP
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c6c6c6]">
                    0-60
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {car.acceleration || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c6c6c6]">
                    Category
                  </p>
                  <p className="mt-1 text-xl font-semibold">{categoryName}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Operations Form Control */}
        <section className="overflow-y-auto bg-[#f9f9f9] p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-xl py-2">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-black">
                Finalize Reservation
              </h2>
              <p className="mt-2 text-base text-[#666666]">
                Complete the details below to secure your executive experience.
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                <p className="text-sm font-semibold">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
                <p className="text-sm font-semibold">{successMessage}</p>
              </div>
            )}

            <form
              id="guest-checkout-form"
              onSubmit={handleConfirmReservation}
              className="space-y-10"
            >
              {/* NEW SUBSECTION CONTAINER: Guest Stateless Contact Identifiers */}
              <div className="space-y-6">
                <h3 className="border-b border-[#E5E5E5] pb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-black">
                  Driver Details (Guest Checkout)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#666666]">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full border-b border-[#E5E5E5] bg-[#f3f3f3] px-3 py-4 text-base outline-none focus:border-black"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#666666]">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full border-b border-[#E5E5E5] bg-[#f3f3f3] px-3 py-4 text-base outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#666666]">
                        Mobile Phone
                      </label>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full border-b border-[#E5E5E5] bg-[#f3f3f3] px-3 py-4 text-base outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Itinerary Data Inputs */}
              <div className="space-y-6">
                <h3 className="border-b border-[#E5E5E5] pb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-black">
                  Itinerary
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#666666]">
                      Pickup Location
                    </label>
                    <div className="flex items-center border-b border-[#E5E5E5] bg-[#f3f3f3] px-3 py-4">
                      <input
                        required
                        className="w-full border-0 bg-transparent text-base outline-none"
                        placeholder="Select Airport or City Terminal"
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                      />
                      <span className="ml-2 text-[#666666]">📍</span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#666666]">
                        Pickup Date
                      </label>
                      <input
                        required
                        className="w-full border-b border-[#E5E5E5] bg-[#f3f3f3] px-3 py-4 text-base outline-none"
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#666666]">
                        Return Date
                      </label>
                      <input
                        required
                        className="w-full border-b border-[#E5E5E5] bg-[#f3f3f3] px-3 py-4 text-base outline-none"
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#666666]">
                        Time
                      </label>
                      <input
                        required
                        className="w-full border-b border-[#E5E5E5] bg-[#f3f3f3] px-3 py-4 text-base outline-none"
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chauffeur Toggle Layer */}
              <div className="flex items-center justify-between rounded-[20px] border border-[#E5E5E5] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🚘</span>
                  <div>
                    <p className="font-semibold text-black">
                      Professional Chauffeur
                    </p>
                    <p className="text-sm text-[#666666]">
                      Recommended for executive comfort (+$100/day)
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={hasChauffeur}
                    onChange={(e) => setHasChauffeur(e.target.checked)}
                  />
                  <div className="h-6 w-11 rounded-full bg-[#e8e8e8] after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-black peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              {/* Enhancements Optional Matrix Selection checkboxes */}
              <div className="space-y-6">
                <h3 className="border-b border-[#E5E5E5] pb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-black">
                  Enhancements
                </h3>
                <div className="grid gap-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-[#f3f3f3] p-4 transition hover:border-[#E5E5E5]">
                    <div className="flex items-center gap-3">
                      <input
                        className="h-5 w-5 rounded-none border-[#E5E5E5] checked:bg-black"
                        type="checkbox"
                        checked={hasDelivery}
                        onChange={(e) => setHasDelivery(e.target.checked)}
                      />
                      <span className="text-base text-black">
                        Concierge Delivery & Retrieval
                      </span>
                    </div>
                    <span className="text-sm text-[#666666]">+$150</span>
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-[#f3f3f3] p-4 transition hover:border-[#E5E5E5]">
                    <div className="flex items-center gap-3">
                      <input
                        disabled
                        defaultChecked
                        className="h-5 w-5 rounded-none border-[#E5E5E5] accent-black"
                        type="checkbox"
                      />
                      <span className="text-base text-black">
                        Executive Platinum Insurance
                      </span>
                    </div>
                    <span className="text-sm text-[#666666]">Included</span>
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-[#f3f3f3] p-4 transition hover:border-[#E5E5E5]">
                    <div className="flex items-center gap-3">
                      <input
                        className="h-5 w-5 rounded-none border-[#E5E5E5] checked:bg-black"
                        type="checkbox"
                        checked={hasSatellite}
                        onChange={(e) => setHasSatellite(e.target.checked)}
                      />
                      <span className="text-base text-black">
                        Satellite Connectivity Pro
                      </span>
                    </div>
                    <span className="text-sm text-[#666666]">+$45/day</span>
                  </label>
                </div>
              </div>

              {/* Investment Dynamic Cost Calculation Panel */}
              <div className="rounded-3xl bg-black p-8 text-white">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                  Investment Summary
                </h3>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">Daily Vehicle Rate</span>
                    <span>${pricingCalculations.dailyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Rental Duration</span>
                    <span>
                      {rentalDays} {rentalDays === 1 ? "Day" : "Days"}
                    </span>
                  </div>
                  {pricingCalculations.addOns > 0 && (
                    <div className="flex justify-between">
                      <span className="text-white/80">Selected Add-ons</span>
                      <span>${pricingCalculations.addOns}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/80">
                      Service & Luxury Tax (12%)
                    </span>
                    <span>${pricingCalculations.tax.toFixed(2)}</span>
                  </div>
                  <div className="mt-6 flex items-baseline justify-between border-t border-white/10 pt-6">
                    <span className="text-xl font-semibold">Total</span>
                    <span className="text-3xl font-bold">
                      ${pricingCalculations.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  disabled={isSubmitting}
                  className="mt-8 w-full rounded-full bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f3f3f3] disabled:bg-gray-400"
                  type="submit"
                >
                  {isSubmitting
                    ? "Processing Request..."
                    : "Confirm Reservation"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}
