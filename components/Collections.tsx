"use client";

import React, { useState } from "react";

interface Category {
  id: string;
  name: string;
  icon: React.JSX.Element;
}

export default function Collections(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>("sports");

  const categories: Category[] = [
    {
      id: "sports",
      name: "Sports",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* Speedometer Icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
    },
    {
      id: "suv",
      name: "SUV",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* 4x4 Grid Icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      id: "electric",
      name: "Electric",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* Lightning Bolt Icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: "vintage",
      name: "Vintage",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* Clockwise History/Vintage Icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="collections"
      className="py-20 bg-[var(--background)] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--outline)]">
              Curated Selection
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)] mt-1">
              Collections
            </h2>
          </div>

          <a
            href="#fleet"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] hover:opacity-80 transition-all"
          >
            View All
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>

        {/* Category Filter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center justify-center p-8 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--on-primary)] shadow-lg scale-[1.02]"
                    : "bg-[var(--surface-container-lowest)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--outline-variant)]"
                }`}
              >
                <div
                  className={`mb-3 ${isActive ? "text-[var(--on-primary)]" : "text-[var(--text-secondary)]"}`}
                >
                  {category.icon}
                </div>
                <span className="text-xs font-bold tracking-widest uppercase">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
