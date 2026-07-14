"use client";

import { useState } from "react";
import AddCarModal from "../components/AddCarModal";

// Placeholder data — swapped for a real fetch once /api/cars exists
const mockCars = [
  {
    id: "1",
    name: "Toyota Camry",
    brand: "Toyota",
    category: "Sedan",
    pricePerDay: 45,
    status: "available",
  },
  {
    id: "2",
    name: "Ford Explorer",
    brand: "Ford",
    category: "SUV",
    pricePerDay: 65,
    status: "booked",
  },
  {
    id: "3",
    name: "Honda Civic",
    brand: "Honda",
    category: "Sedan",
    pricePerDay: 38,
    status: "maintenance",
  },
];

const statusStyles: Record<string, string> = {
  available: "bg-success/10 text-success border border-success/20",
  booked: "bg-signal/10 text-signal border border-signal/20",
  maintenance: "bg-danger/10 text-danger border border-danger/20",
};

export default function AdminCarsPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCars = mockCars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-ink font-semibold tracking-tight">
            Cars
          </h1>
          <p className="text-sm text-ink/50 mt-0.5">
            Manage your fleet inventory assets.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-ink text-canvas text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-lg hover:bg-ink/90 transition shadow-md active:scale-95 duration-200"
        >
          + Add car
        </button>
      </div>

      {/* Main Glassmorphic Wrapper */}
      <div className="bg-ink/[0.02] backdrop-blur-sm rounded-xl border border-line/40 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-line/40 flex items-center gap-3 bg-white/40">
          <input
            type="text"
            placeholder="Search cars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-xs bg-canvas/50 border border-line/40 rounded-lg px-3.5 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-signal focus:border-signal transition placeholder:text-ink/30"
          />
          <select className="rounded-lg border border-line/40 bg-canvas/50 px-3 py-2 text-sm text-ink/70 focus:outline-none focus:ring-1 focus:ring-signal">
            <option>All statuses</option>
            <option>Available</option>
            <option>Booked</option>
            <option>Maintenance</option>
          </select>
        </div>

        {/* Table View Node Layout */}
        {filteredCars.length === 0 ? (
          <div className="py-16 text-center text-sm text-ink/40">
            No cars match your search — try a different name, or add a new car
            to the fleet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-ink/50 border-b border-line/40 bg-ink/[0.01]">
                  <th className="font-semibold px-5 py-3 tracking-wide uppercase text-[10px]">
                    Name
                  </th>
                  <th className="font-semibold px-5 py-3 tracking-wide uppercase text-[10px]">
                    Brand
                  </th>
                  <th className="font-semibold px-5 py-3 tracking-wide uppercase text-[10px]">
                    Category
                  </th>
                  <th className="font-semibold px-5 py-3 tracking-wide uppercase text-[10px]">
                    Price/day
                  </th>
                  <th className="font-semibold px-5 py-3 tracking-wide uppercase text-[10px]">
                    Status
                  </th>
                  <th className="font-semibold px-5 py-3 tracking-wide uppercase text-[10px] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car) => (
                  <tr
                    key={car.id}
                    className="border-b border-line/30 last:border-0 hover:bg-canvas/40 transition duration-150"
                  >
                    <td className="px-5 py-3.5 text-ink font-medium">
                      {car.name}
                    </td>
                    <td className="px-5 py-3.5 text-ink/70">{car.brand}</td>
                    <td className="px-5 py-3.5 text-ink/70">{car.category}</td>
                    <td className="px-5 py-3.5 text-ink/70">
                      ${car.pricePerDay}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium capitalize inline-block ${statusStyles[car.status]}`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-3">
                      <button
                        onClick={() => {
                          /* Trigger Edit functionality later */
                        }}
                        className="text-ink/50 hover:text-ink text-xs font-medium transition"
                      >
                        Edit
                      </button>
                      <button className="text-danger/70 hover:text-danger text-xs font-medium transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= ADD CAR MODAL LINK MOUNT ================= */}
      <AddCarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
