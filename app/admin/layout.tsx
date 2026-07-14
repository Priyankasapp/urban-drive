"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-canvas font-[family-name:var(--font-body)] relative overflow-x-hidden">
      {/* Decorative background glow elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-signal/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-signal/5 blur-[150px] pointer-events-none" />

      {/* ================= MODULAR SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      {/* lg:pl-[288px] gives exactly 16px of breathing room after the 256px (w-64) sidebar */}
      <div className="min-h-screen flex flex-col min-w-0 z-10 lg:pl-[288px] transition-all duration-300">
        {/* ================= MODULAR GLASS HEADER ================= */}
        <Header />

        {/* Main dynamic view area */}
        <main className="flex-1 px-8 py-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
