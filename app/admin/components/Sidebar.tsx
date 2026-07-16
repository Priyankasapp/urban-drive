"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import {
  LayoutDashboard,
  Car,
  CalendarRange,
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

  // Animation References
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLElement>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // 1. Initial Load Entry Animation (Desktop & Mobile Panel slide)
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Smoothly fade and pop the panel into view
      tl.fromTo(
        sidebarRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
      );

      // Cascade link entry slightly one after another
      if (navLinksRef.current) {
        const links = navLinksRef.current.querySelectorAll(".nav-item");
        tl.fromTo(
          links,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.2", // Overlap slightly with sidebar animation
        );
      }
    },
    { scope: sidebarRef },
  );

  // 2. Micro-interactions for Link Hover States
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const icon = e.currentTarget.querySelector(".nav-icon");
    const text = e.currentTarget.querySelector(".nav-text");

    gsap.to(icon, { x: 3, scale: 1.05, duration: 0.2, ease: "power1.out" });
    gsap.to(text, { x: 2, duration: 0.2, ease: "power1.out" });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const icon = e.currentTarget.querySelector(".nav-icon");
    const text = e.currentTarget.querySelector(".nav-text");

    gsap.to(icon, { x: 0, scale: 1, duration: 0.2, ease: "power1.out" });
    gsap.to(text, { x: 0, duration: 0.2, ease: "power1.out" });
  };

  return (
    <>
      {/* ================= MOBILE TOGGLE TRIGGER ================= */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 rounded-xl glassmorphism p-2.5 shadow-md lg:hidden transition-all duration-200"
        style={{ color: "var(--text-primary)" }}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Dim Overlay for Mobile Navigation */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-900/30 dark:bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================= MODULAR SIDEBAR ================= */}
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 bottom-0 z-40 w-64 h-[calc(100vh-32px)] my-4 ml-4 flex flex-col p-6 
        glassmorphism rounded-xl shadow-xl transition-transform duration-300 ease-in-out opacity-0
        ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"} 
        lg:translate-x-0`}
      >
        {/* Brand/App Title Header */}
        <div
          className="flex items-center gap-2 mt-8 lg:mt-0 mb-6 pb-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span
            className="text-base tracking-tight font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            UrbanDrive <span style={{ color: "var(--primary)" }}>Ops</span>
          </span>
        </div>

        {/* User Identity Banner */}
        <div className="mb-6 px-1">
          <div className="flex flex-col gap-0.5">
            <h2
              className="text-lg font-semibold tracking-tight leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Alex Rivers
            </h2>
            <p
              className="text-xs font-semibold tracking-wider uppercase opacity-60"
              style={{ color: "var(--text-secondary)" }}
            >
              Fleet Manager
            </p>
          </div>
        </div>

        {/* Main Navigation Item Selection */}
        <nav
          ref={navLinksRef}
          className="flex-grow space-y-1 overflow-y-auto pr-1"
        >
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive =
              pathname === menu.href || pathname?.startsWith(menu.href + "/");

            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() => setIsOpen(false)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="nav-item relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: isActive
                    ? "var(--primary-container)"
                    : "transparent",
                  color: isActive
                    ? "var(--on-primary-container)"
                    : "var(--text-secondary)",
                }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full"
                    style={{ backgroundColor: "var(--primary)" }}
                  />
                )}

                <Icon
                  size={18}
                  className="nav-icon transition-colors"
                  style={{ color: isActive ? "var(--primary)" : "inherit" }}
                />
                <span className="nav-text transition-colors">{menu.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Navigation Block */}
        <div
          className="mt-auto pt-4 border-t space-y-1"
          style={{ borderColor: "var(--border)" }}
        >
          <Link
            href="/admin/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            style={{ color: "var(--text-secondary)" }}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
