"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ctaSection } from "@/data/about";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-black py-24 lg:py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />

      {/* Decorative Blur */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          Ready to Experience Luxury?
        </span>

        <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          {ctaSection.title}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
          {ctaSection.subtitle}
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Link
            href="/cars"
            className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-gray-200"
          >
            {ctaSection.primaryButton}

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/contact"
            className="rounded-full border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
          >
            {ctaSection.secondaryButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
