const stats = [
  { label: "Total Cars", value: "—", sub: "in fleet" },
  { label: "Active Bookings", value: "—", sub: "currently confirmed" },
  { label: "Pending Requests", value: "—", sub: "awaiting review" },
  { label: "New Messages", value: "—", sub: "unread" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-ink mb-1">
        Overview
      </h1>
      <p className="text-sm text-ink/50 mb-8">
        Fleet and booking activity at a glance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-line p-5"
          >
            <p className="text-xs text-ink/50 mb-2">{stat.label}</p>
            <p className="font-[family-name:var(--font-display)] text-3xl text-ink mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-ink/40">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-line p-5">
        <h2 className="font-[family-name:var(--font-display)] text-base text-ink mb-4">
          Recent bookings
        </h2>
        <div className="text-sm text-ink/40 py-8 text-center">
          No bookings yet — this will populate once the Bookings API is
          connected.
        </div>
      </div>
    </div>
  );
}
