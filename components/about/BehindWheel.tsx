"use client";

import Image from "next/image";
import { experienceSection } from "@/data/about";

export default function BehindWheel() {
  const Icon = experienceSection.icon;

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        {/* Left Content */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            {experienceSection.badge}
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {experienceSection.title}
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            {experienceSection.description}
          </p>

          {/* Features */}
          <div className="mt-10 space-y-5">
            {experienceSection.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:border-black hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                  <Icon size={18} />
                </div>

                <p className="font-medium text-gray-900">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
          <Image
            src={experienceSection.image}
            alt={experienceSection.title}
            width={700}
            height={700}
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
