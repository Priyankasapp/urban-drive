"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

interface Car {
  _id: string;
  name: string;
  pricePerDay: number;
  images: string[];
  category: { name: string };
  brand: { name: string };
  transmission: string;
  fuelType: string;
}

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected Car
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [loadingCars, setLoadingCars] = useState(true);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const dateParam = searchParams.get("date") ?? "";
  const initialReturnDate = dateParam
    ? (() => {
        const nextDay = new Date(dateParam);
        nextDay.setDate(nextDay.getDate() + 2);
        return nextDay.toISOString().split("T")[0];
      })()
    : "";
  const [pickupDate, setPickupDate] = useState(dateParam);
  const [returnDate, setReturnDate] = useState(initialReturnDate);

  // Booking Feedback State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successBooking, setSuccessBooking] = useState<any>(null);

  // Fetch Cars & Prepopulate from Query parameters
  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await fetch("/api/cars");
        const data = await res.json();
        if (data.success) {
          setCars(data.cars);

          // Attempt to pre-select a car based on search params
          const carIdParam = searchParams.get("carId");
          if (carIdParam) {
            const found = data.cars.find((c: Car) => c._id === carIdParam);
            if (found) setSelectedCar(found);
          } else if (data.cars.length > 0) {
            setSelectedCar(data.cars[0]); // Default to first car
          }
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoadingCars(false);
      }
    }

    fetchCars();

    // Prepopulate date fields from search params if present
    const dateParam = searchParams.get("date");
    if (dateParam) {
      setPickupDate(dateParam);
      // Default return date is next day
      const nextDay = new Date(dateParam);
      nextDay.setDate(nextDay.getDate() + 2);
      setReturnDate(nextDay.toISOString().split("T")[0]);
    }
  }, [searchParams]);

  // Pricing calculations
  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (pickupDate && returnDate && selectedCar) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diffTime = end.getTime() - start.getTime();
      if (diffTime > 0) {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDays(diffDays);
        setTotalPrice(diffDays * selectedCar.pricePerDay);
        setError("");
      } else {
        setDays(0);
        setTotalPrice(0);
        setError("Return date must be after pickup date");
      }
    } else if (selectedCar) {
      setDays(1);
      setTotalPrice(selectedCar.pricePerDay);
    }
  }, [pickupDate, returnDate, selectedCar]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) {
      setError("Please select a vehicle");
      return;
    }
    if (days <= 0) {
      setError("Please select valid dates");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: selectedCar._id,
          customerName,
          customerEmail,
          customerPhone,
          licenseNumber,
          pickupDate,
          returnDate,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setSuccessBooking(result.booking);
      } else {
        setError(result.message || "Failed to create booking request");
      }
    } catch (err) {
      setError("Server connection failure. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successBooking) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center animate-fade-in">
        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-8 border border-success/20">
          <CheckCircle2 size={40} className="stroke-[1.5]" />
        </div>
        <h1 className="text-3xl font-normal tracking-tight mb-2">
          Reservation Confirmed
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-8">
          Thank you for choosing UrbanDrive. Your reservation is pending
          verification. Our concierge team will contact you shortly.
        </p>

        {/* Booking Details Glass Summary */}
        <div className="bg-ink/[0.02] border border-line rounded-2xl p-6 text-left mb-8 space-y-4 max-w-md mx-auto backdrop-blur-md">
          <div className="flex justify-between border-b border-line pb-3">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">
              Reference
            </span>
            <span className="text-sm font-semibold tracking-wider">
              {successBooking.bookingRef}
            </span>
          </div>
          <div className="flex justify-between border-b border-line pb-3">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">
              Vehicle
            </span>
            <span className="text-sm font-semibold">
              {successBooking.carSnapshot?.name}
            </span>
          </div>
          <div className="flex justify-between border-b border-line pb-3">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">
              Duration
            </span>
            <span className="text-sm">{days} Days</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">
              Amount Paid
            </span>
            <span className="text-base font-bold text-[var(--text-primary)]">
              ${successBooking.totalPrice}
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--on-primary)] rounded-lg text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all duration-200"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Homepage
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Booking Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-normal tracking-tight mb-2">
              Book Your Fleet Asset
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Complete the verification credentials to deploy your supercar.
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-6">
            {/* Step 1: Vehicle selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Select Vehicle
              </label>
              {loadingCars ? (
                <div className="h-14 bg-surface-container animate-pulse rounded-xl" />
              ) : (
                <select
                  value={selectedCar?._id || ""}
                  onChange={(e) => {
                    const car = cars.find((c) => c._id === e.target.value);
                    if (car) setSelectedCar(car);
                  }}
                  className="w-full bg-transparent border-b border-[var(--border)] py-3 text-sm focus:border-[var(--primary)] outline-none transition-colors"
                >
                  {cars.map((car) => (
                    <option
                      key={car._id}
                      value={car._id}
                      className="text-black"
                    >
                      {car.name} — ${car.pricePerDay}/day
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Step 2: Personal Credentials */}
            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                1. Driver Credentials
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="peer w-full py-3.5 pl-8 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition-colors duration-300 placeholder-transparent"
                    placeholder="Full Name"
                    id="name"
                  />
                  <User className="absolute left-0 top-3.5 w-4.5 h-4.5 text-[var(--text-secondary)]" />
                  <label
                    htmlFor="name"
                    className="absolute left-8 top-3.5 text-sm text-[var(--text-secondary)] pointer-events-none transition-all duration-300 
                      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                      peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[var(--primary)]
                      peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Full Name
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="peer w-full py-3.5 pl-8 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition-colors duration-300 placeholder-transparent"
                    placeholder="Email Address"
                    id="email"
                  />
                  <Mail className="absolute left-0 top-3.5 w-4.5 h-4.5 text-[var(--text-secondary)]" />
                  <label
                    htmlFor="email"
                    className="absolute left-8 top-3.5 text-sm text-[var(--text-secondary)] pointer-events-none transition-all duration-300 
                      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                      peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[var(--primary)]
                      peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Email Address
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="peer w-full py-3.5 pl-8 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition-colors duration-300 placeholder-transparent"
                    placeholder="Phone Number"
                    id="phone"
                  />
                  <Phone className="absolute left-0 top-3.5 w-4.5 h-4.5 text-[var(--text-secondary)]" />
                  <label
                    htmlFor="phone"
                    className="absolute left-8 top-3.5 text-sm text-[var(--text-secondary)] pointer-events-none transition-all duration-300 
                      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                      peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[var(--primary)]
                      peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Phone Number
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="peer w-full py-3.5 pl-8 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition-colors duration-300 placeholder-transparent"
                    placeholder="Driver's License"
                    id="license"
                  />
                  <FileText className="absolute left-0 top-3.5 w-4.5 h-4.5 text-[var(--text-secondary)]" />
                  <label
                    htmlFor="license"
                    className="absolute left-8 top-3.5 text-sm text-[var(--text-secondary)] pointer-events-none transition-all duration-300 
                      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                      peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[var(--primary)]
                      peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Drivers License ID
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Date Selectors */}
            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                2. Scheduling
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="pickup"
                    className="text-xs text-[var(--text-secondary)] font-medium"
                  >
                    Pickup Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="pickup"
                      required
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full py-3 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="return"
                    className="text-xs text-[var(--text-secondary)] font-medium"
                  >
                    Return Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="return"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full py-3 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message banner */}
            {error && (
              <div className="text-xs text-danger bg-danger/10 border border-danger/20 p-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            {/* Submit Block */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90 disabled:opacity-55 active:scale-[0.99] transition-all duration-300 text-xs font-semibold tracking-[0.2em] flex items-center justify-center gap-2 shadow-md"
            >
              {submitting ? "VERIFYING CREDENTIALS..." : "CONFIRM RESERVATION"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Side: Vehicle Summary & Cost */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-ink/[0.01] border border-line rounded-2xl p-8 space-y-6 shadow-sm backdrop-blur-md">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Reservation Summary
            </h3>

            {selectedCar ? (
              <div className="space-y-6">
                {/* Image & Title */}
                <div className="space-y-3">
                  <div className="relative h-48 w-full rounded-xl overflow-hidden border border-line bg-black/5">
                    <Image
                      src={selectedCar.images[0] || "/assets/car1.jpeg"}
                      alt={selectedCar.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">
                      {selectedCar.name}
                    </h4>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-ink/[0.04] text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mt-1.5">
                      {selectedCar.category?.name || "Premium Fleet"}
                    </span>
                  </div>
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-2 gap-4 text-xs border-t border-b border-line py-4">
                  <div>
                    <span className="text-[var(--text-secondary)] block">
                      Transmission
                    </span>
                    <span className="font-semibold capitalize mt-0.5 block">
                      {selectedCar.transmission}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">
                      Fuel Station
                    </span>
                    <span className="font-semibold capitalize mt-0.5 block">
                      {selectedCar.fuelType}
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">
                      ${selectedCar.pricePerDay} × {days} days
                    </span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">
                      Concierge Fee
                    </span>
                    <span className="text-success font-medium">Included</span>
                  </div>
                  <div className="flex justify-between border-t border-line pt-3 font-semibold">
                    <span className="text-sm text-[var(--text-primary)]">
                      Total Price
                    </span>
                    <span className="text-lg">${totalPrice}</span>
                  </div>
                </div>

                <div className="flex gap-2 text-[10px] text-[var(--text-secondary)] bg-ink/[0.02] border border-line p-3.5 rounded-xl">
                  <ShieldCheck
                    size={16}
                    className="text-[var(--outline)] flex-shrink-0"
                  />
                  <span>
                    Rental includes premium coverage protection & roadside
                    backup concierge.
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-[var(--text-secondary)]">
                Please select a car to view summary details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] pt-24">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-6 py-12 text-center text-sm text-[var(--text-secondary)]">
            Loading reservation config...
          </div>
        }
      >
        <BookingFormContent />
      </Suspense>
    </main>
  );
}
