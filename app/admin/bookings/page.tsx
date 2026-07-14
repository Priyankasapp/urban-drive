"use client";

import { useState } from "react";
import Link from "next/link";

const mockBookings = [
  {
    id: "1",
    bookingRef: "UD-2026-00042",
    carName: "Toyota Camry",
    customerName: "Rohan Mehta",
    pickupDate: "2026-07-20",
    returnDate: "2026-07-24",
    totalPrice: 180,
    status: "pending",
  },
  {
    id: "2",
    bookingRef: "UD-2026-00041",
    carName: "Ford Explorer",
    customerName: "Aisha Khan",
    pickupDate: "2026-07-15",
    returnDate: "2026-07-18",
    totalPrice: 195,
    status: "confirmed",
  },
  {
    id: "3",
    bookingRef: "UD-2026-00040",
    carName: "Honda Civic",
    customerName: "Vikram Shah",
    pickupDate: "2026-07-10",
    returnDate: "2026-07-12",
    totalPrice: 76,
    status: "completed",
  },
  {
    id: "4",
    bookingRef: "UD-2026-00039",
    carName: "Toyota Camry",
    customerName: "Neha Patel",
    pickupDate: "2026-07-08",
    returnDate: "2026-07-09",
    totalPrice: 45,
    status: "cancelled",
  },
];

const statusStyles: Record<string, string> = {
  pending: "bg-signal/10 text-signal",
  confirmed: "bg-success/10 text-success",
  completed: "bg-ink/10 text-ink/70",
  cancelled: "bg-danger/10 text-danger",
};

export default function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockBookings.filter((b) => {
    const matchesSearch =
      b.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-ink mb-1">
          Bookings
        </h1>
        <p className="text-sm text-ink/50">
          Review and manage rental requests.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-line overflow-hidden">
        <div className="p-4 border-b border-line flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by ref or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-xs rounded-lg border border-line px-3.5 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-signal focus:border-signal transition"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-line px-3 py-2 text-sm text-ink/70 focus:outline-none focus:ring-2 focus:ring-signal"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-ink/40">
            No bookings match this search — try a different reference or
            customer name.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/50 border-b border-line">
                <th className="font-medium px-5 py-3">Reference</th>
                <th className="font-medium px-5 py-3">Car</th>
                <th className="font-medium px-5 py-3">Customer</th>
                <th className="font-medium px-5 py-3">Dates</th>
                <th className="font-medium px-5 py-3">Total</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-line last:border-0 hover:bg-canvas/50 transition"
                >
                  <td className="px-5 py-3.5 text-ink font-medium">
                    {b.bookingRef}
                  </td>
                  <td className="px-5 py-3.5 text-ink/70">{b.carName}</td>
                  <td className="px-5 py-3.5 text-ink/70">{b.customerName}</td>
                  <td className="px-5 py-3.5 text-ink/70 whitespace-nowrap">
                    {b.pickupDate} → {b.returnDate}
                  </td>
                  <td className="px-5 py-3.5 text-ink/70">${b.totalPrice}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="text-ink/50 hover:text-ink text-xs font-medium"
                    >
                      View
                    </Link>
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
