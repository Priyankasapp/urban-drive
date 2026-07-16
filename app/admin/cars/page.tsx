"use client";

import { useMemo, useState, useRef } from "react";
import { type CarData, useCars } from "@/context/CarContext";
import AddCarModal from "../components/AddCarModal";
import EditCarModal from "../components/EditCarModal";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const statusStyles: Record<string, string> = {
  available: "badge-available",
  booked: "badge-rented",
  maintenance: "badge-maintenance",
};

export default function AdminCarsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);
  const { cars, loading, deletingCarId, errorMsg, setErrorMsg, deleteCar } =
    useCars();

  const gridRef = useRef<HTMLDivElement>(null);

  const filteredCars = useMemo(() => {
    const query = search.toLowerCase();

    return cars.filter((car) => {
      const brandName =
        typeof car.brand === "string" ? car.brand : (car.brand?.name ?? "");
      const categoryName =
        typeof car.category === "string"
          ? car.category
          : (car.category?.name ?? "");
      const statusKey = (car.status || "available").toLowerCase();

      const matchesSearch =
        car.name.toLowerCase().includes(query) ||
        brandName.toLowerCase().includes(query) ||
        categoryName.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All statuses" ||
        statusKey === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [cars, search, statusFilter]);

  useGSAP(() => {
    if (!gridRef.current) return;

    const targetedCards = gridRef.current.querySelectorAll(".executive-card");
    if (targetedCards.length === 0) return;

    gsap.killTweensOf(targetedCards);

    gsap.fromTo(
      targetedCards,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.out",
        clearProps: "transform,opacity",
      },
    );
  }, [filteredCars]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 lg:p-0">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Fleet Directory
          </h1>
          <p
            className="text-sm mt-0.5 opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            Monitor live asset logistics, pricing bands, and vehicle
            availability.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-bold tracking-wider uppercase px-5 py-3 rounded-xl shadow-md hover:brightness-110 active:scale-[0.98] transition-all duration-200"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--on-primary)",
          }}
        >
          + Add Asset
        </button>
      </div>

      {/* Main Container Control Block */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Filter Operations Toolbar */}
        <div
          className="p-4 border-b flex flex-wrap items-center justify-between gap-3 bg-white/40 dark:bg-transparent backdrop-blur-md"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex flex-1 items-center gap-3 max-w-xl">
            <input
              type="text"
              placeholder="Search by model, brand, class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-xs border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--surface-bright)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--surface-bright)",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              <option>All statuses</option>
              <option>Available</option>
              <option>Booked</option>
              <option>Maintenance</option>
            </select>
          </div>

          <div
            className="text-xs font-medium opacity-60"
            style={{ color: "var(--text-secondary)" }}
          >
            Showing {filteredCars.length} of {cars.length} Vehicles
          </div>
        </div>

        {/* Dynamic Inner Layout Grid States */}
        {loading ? (
          <div
            className="py-24 text-center text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: "var(--primary)" }}
            />
            Synchronizing live fleet telemetry...
          </div>
        ) : errorMsg ? (
          <div className="py-16 text-center text-sm font-semibold text-red-500">
            {errorMsg}
          </div>
        ) : filteredCars.length === 0 ? (
          <div
            className="py-24 text-center text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            No vehicle units active matching the current filter parameters.
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCars.map((car) => {
              const brandName =
                typeof car.brand === "string"
                  ? car.brand
                  : (car.brand?.name ?? "—");
              const categoryName =
                typeof car.category === "string"
                  ? car.category
                  : (car.category?.name ?? "—");
              const statusKey = (car.status || "available").toLowerCase();

              // FIXED: Added strict string fallback to guarantee undefined never passes to Next.js Image src
              const thumb =
                car.images && car.images.length > 0
                  ? car.images[0] || "/assets/placeholder-car.png"
                  : "/assets/placeholder-car.png";

              return (
                <div
                  key={car._id}
                  className="executive-card group flex flex-col justify-between overflow-hidden"
                >
                  {/* Photo Display Frame */}
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-950/60 overflow-hidden flex items-center justify-center">
                    <Image
                      src={thumb}
                      alt={car.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      unoptimized
                    />

                    {/* Floating price identifier */}
                    <div className="absolute bottom-3 left-3 z-10 rounded-md backdrop-blur-md bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 text-xs font-bold tracking-tight shadow-sm border border-white/20 dark:border-slate-800">
                      <span style={{ color: "var(--primary)" }}>
                        ${car.pricePerDay}
                      </span>{" "}
                      / day
                    </div>
                  </div>

                  {/* Operational Metrics Block */}
                  <div className="p-5 grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3
                            className="text-base font-bold tracking-tight"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {car.name}
                          </h3>
                          <p
                            className="mt-1 text-xs font-medium tracking-wide"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {brandName} •{" "}
                            <span className="opacity-80 font-normal">
                              {categoryName}
                            </span>
                          </p>
                        </div>

                        {/* Semantic Badging */}
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm ${statusStyles[statusKey] ?? statusStyles.available}`}
                        >
                          {statusKey}
                        </span>
                      </div>
                    </div>

                    {/* Control Utilities Footer */}
                    <div
                      className="mt-6 pt-4 border-t flex items-center justify-end"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="flex gap-2">
                        {/* FIXED: Applied canonical Tailwind CSS v4 variable class styling structures here */}
                        <button
                          onClick={() => {
                            setErrorMsg("");
                            setEditingCar(car);
                          }}
                          className="rounded-lg border px-3 py-1.5 text-xs font-semibold bg-transparent transition-all duration-200 hover:bg-(--primary-container) hover:text-(--on-primary-container) active:scale-95"
                          style={{
                            borderColor: "var(--primary)",
                            color: "var(--primary)",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              !window.confirm(
                                "Are you sure you want to retire this vehicle asset from the active fleet?",
                              )
                            ) {
                              return;
                            }
                            await deleteCar(car._id);
                          }}
                          disabled={deletingCarId !== null}
                          className="rounded-lg border border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 transition hover:brightness-95 disabled:opacity-50"
                        >
                          {deletingCarId === car._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditCarModal
        key={editingCar?._id ?? "closed"}
        car={editingCar}
        onClose={() => setEditingCar(null)}
      />
    </div>
  );
}
