"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLHeadingElement>(null);

  // Generate clean, readable breadcrumb paths for a car rental app
  const pathSegments = pathname?.split("/").filter(Boolean) || [];

  // Filter out the generic operational prefix ("admin") for a cleaner path
  const filteredSegments = pathSegments.filter(
    (segment) => segment.toLowerCase() !== "admin",
  );

  const breadcrumbs = filteredSegments
    .map((segment) => {
      // Clean up hyphens and capitalize the first letter of each word
      const words = segment.replace(/-/g, " ").split(" ");
      return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    })
    .join(" / ");

  // GSAP Smooth Entrance Timeline
  useGSAP(
    () => {
      if (!headerRef.current) return;

      const tl = gsap.timeline();

      // Fade and slide down the entire header element slightly
      tl.fromTo(
        headerRef.current,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      );

      // Slide breadcrumbs from the left
      tl.fromTo(
        headerRef.current.querySelector(".header-breadcrumbs"),
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.3", // overlap transitions slightly
      );

      // Slide profile badge from the right
      tl.fromTo(
        headerRef.current.querySelector(".header-profile"),
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.4",
      );
    },
    { scope: headerRef },
  ); // Scopes targets down to keep execution isolated

  return (
    <header
      ref={headerRef}
      className="h-16 flex items-center justify-between px-8 mt-4 mr-4 glassmorphism rounded-xl shadow-sm opacity-0"
    >
      {/* Breadcrumb Path Display */}
      <div className="header-breadcrumbs flex items-center gap-2 opacity-0">
        <p
          className="text-xs tracking-wider font-bold uppercase opacity-70"
          style={{ color: "var(--text-secondary)" }}
        >
          {breadcrumbs || "Dashboard"}
        </p>
      </div>

      {/* Fleet Operator Profile Box */}
      <div
        className="header-profile flex items-center gap-3 px-3 py-1.5 rounded-full border bg-slate-100/50 dark:bg-slate-800/40 opacity-0 animate-none"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-xs font-semibold tracking-wide uppercase opacity-80">
          Super Admin
        </span>

        {/* Visual profile token utilizing our premium blue theme color */}
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm"
          style={{
            backgroundColor: "var(--primary-container)",
            color: "var(--on-primary-container)",
          }}
        >
          SA
        </span>
      </div>
    </header>
  );
}
