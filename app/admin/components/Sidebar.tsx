"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Car, // Updated from Building2
  CalendarRange, // Updated from Users
  Settings,
  LogOut,
  Menu,
  X,
  LucideIcon,
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const menus: MenuItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Cars", href: "/admin/cars", icon: Car },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarRange },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* ================= MOBILE TOGGLE TRIGGER ================= */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 rounded-xl bg-ink/40 backdrop-blur-md p-2.5 text-canvas border border-canvas/10 lg:hidden shadow-lg hover:bg-ink/60 transition-all duration-300"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Dim Overlay for Mobile Navigation */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================= MODULAR GLASS SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 w-64 h-[calc(100vh-32px)] my-4 mx-4 lg:mx-0 lg:ml-4 flex flex-col p-6 
        bg-ink/40 backdrop-blur-md border border-canvas/10 text-canvas rounded-xl shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        {/* Brand/App Title Header */}
        <div className="flex items-center gap-2 mt-8 lg:mt-0 mb-6 pb-4 border-b border-canvas/5">
          <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
          <span className="font-[family-name:var(--font-display)] text-base tracking-tight font-medium">
            UrbanDrive
          </span>
        </div>

        {/* User Identity Banner */}
        <div className="mb-6 px-1">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-semibold tracking-tight text-canvas leading-snug">
              Alex Rivers
            </h2>
            <p className="text-xs font-medium text-canvas/50 tracking-wide uppercase">
              Senior Scholar
            </p>
          </div>
        </div>

        {/* Main Navigation Item Selection */}
        <nav className="flex-grow space-y-1 overflow-y-auto pr-1">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive =
              pathname === menu.href || pathname?.startsWith(menu.href + "/");

            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() => setIsOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300
                ${
                  isActive
                    ? "bg-canvas/10 text-canvas shadow-inner border border-canvas/10"
                    : "text-canvas/60 hover:text-canvas hover:bg-canvas/5"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-signal" />
                )}
                <Icon
                  size={18}
                  className={isActive ? "text-canvas" : "text-canvas/60"}
                />
                <span className="font-medium">{menu.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Navigation Block */}
        <div className="mt-auto pt-4 border-t border-canvas/5 space-y-4">
          <div className="space-y-0.5">
            <Link
              href="/super-admin/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-canvas/60 hover:text-canvas hover:bg-canvas/5 transition-colors duration-300 rounded-lg"
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            <button
              onClick={async () => {
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-canvas/60 hover:text-[var(--primary)] hover:bg-canvas/5 transition-colors duration-300 rounded-lg"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
