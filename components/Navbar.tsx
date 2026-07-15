"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  // Initialize state directly from localStorage to prevent cascading renders
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  const [isOpen, setIsOpen] = useState(false);

  // The effect now ONLY handles the external side effect (updating the DOM)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]); // Fires only when darkMode changes

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Cars", href: "/cars" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="glassmorphism fixed top-0 left-0 right-0 z-50 h-15 transition-all duration-300">
      <div className="max-w-7xl px-30 mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand Logo */}
        <div className="text-sm font-black tracking-widest text-[var(--text-primary)]">
          Urban<span className="text-[var(--outline)]">Drive.</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-medium tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Toggle Button */}
          {/* <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full border border-[var(--border)] hover:bg-[var(--surface-container)] text-[var(--text-primary)] transition-all duration-200 animate-none"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button> */}

          {/* Core Call to Action Button */}
          <a
            href="#booking"
            className="px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90 transition-opacity duration-200"
          >
            Booking
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-3 md:hidden">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md border border-[var(--border)] text-[var(--text-primary)]"
          >
            {darkMode ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-[var(--text-primary)] focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[var(--background)] border-b border-[var(--border)] px-6 py-6 space-y-4 flex flex-col items-start transition-all duration-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-[var(--text-primary)] w-full py-2 border-b border-[var(--surface-container)]"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3 rounded-lg bg-[var(--primary)] text-[var(--on-primary)] font-semibold tracking-wider uppercase text-sm"
          >
            Booking
          </a>
        </div>
      )}
    </nav>
  );
}
