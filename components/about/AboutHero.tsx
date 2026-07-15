"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { aboutHero } from "@/data/about";

export default function AboutHero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={aboutHero.image}
          alt={aboutHero.title}
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge */}
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-200 backdrop-blur-sm">
            {aboutHero.badge}
          </span>

          {/* Heading */}
          <h1 className="mt-8 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            {aboutHero.title}
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-300">
            {aboutHero.description}
          </p>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href="/cars"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-gray-200"
            >
              {aboutHero.button}

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
