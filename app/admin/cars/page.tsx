"use client";

import { useState } from "react";
import Link from "next/link";

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
  available: "bg-success/10 text-success",
  booked: "bg-signal/10 text-signal",
  maintenance: "bg-danger/10 text-danger",
};

export default function AdminCarsPage() {
  const [search, setSearch] = useState("");

  const filteredCars = mockCars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-ink mb-1">
            Cars
          </h1>
          <p className="text-sm text-ink/50">Manage your fleet.</p>
        </div>
        <Link
          href="/admin/cars/new"
          className="bg-ink text-canvas text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-ink/90 transition"
        >
          + Add car
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-line overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-line flex items-center gap-3">
          <input
            type="text"
            placeholder="Search cars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-xs rounded-lg border border-line px-3.5 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-signal focus:border-signal transition"
          />
          <select className="rounded-lg border border-line px-3 py-2 text-sm text-ink/70 focus:outline-none focus:ring-2 focus:ring-signal">
            <option>All statuses</option>
            <option>Available</option>
            <option>Booked</option>
            <option>Maintenance</option>
          </select>
        </div>

        {/* Table */}
        {filteredCars.length === 0 ? (
          <div className="py-16 text-center text-sm text-ink/40">
            No cars match your search — try a different name, or add a new car
            to the fleet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/50 border-b border-line">
                <th className="font-medium px-5 py-3">Name</th>
                <th className="font-medium px-5 py-3">Brand</th>
                <th className="font-medium px-5 py-3">Category</th>
                <th className="font-medium px-5 py-3">Price/day</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr
                  key={car.id}
                  className="border-b border-line last:border-0 hover:bg-canvas/50 transition"
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
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[car.status]}`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/cars/${car.id}/edit`}
                      className="text-ink/50 hover:text-ink text-xs font-medium mr-3"
                    >
                      Edit
                    </Link>
                    <button className="text-danger/70 hover:text-danger text-xs font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
