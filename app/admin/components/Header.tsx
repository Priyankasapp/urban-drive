"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Generate clean breadcrumb text from the path segments
  const breadcrumbs = pathname
    ?.split("/")
    .filter(Boolean)
    // Replace hyphens with spaces for cleaner reading (e.g., "super-admin" -> "super admin")
    .map((segment) => segment.replace(/-/g, " "))
    .join(" / ");

  return (
    <header className="h-16 border border-line/40 backdrop-blur-md bg-canvas/30 flex items-center justify-between px-8 mt-4 mr-4 rounded-xl">
      {/* Breadcrumb Path */}
      <p className="text-xs tracking-wider font-semibold text-ink/50 uppercase">
        {breadcrumbs || "Dashboard"}
      </p>

      {/* Super Admin Profile Box */}
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-ink/[0.03] border border-line/10">
        <span className="text-xs font-semibold tracking-wide text-ink/70 uppercase">
          Super Admin
        </span>
        <span className="w-7 h-7 rounded-full bg-signal/15 flex items-center justify-center text-[10px] font-bold text-signal shadow-sm">
          SA
        </span>
      </div>
    </header>
  );
}
