"use client";

import Image from "next/image";
import { storySection } from "@/data/about";

export default function OurStory() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        {/* Left Image */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
          <Image
            src={storySection.image}
            alt={storySection.title}
            width={700}
            height={700}
            className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 border border-white/10" />
        </div>

        {/* Right Content */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Our Story
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {storySection.title}
          </h2>

          <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
            {storySection.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-gray-200 pt-8">
            {storySection.stats.map((stat) => (
              <div key={stat.label}>
                <h3 className="text-4xl font-bold text-black">{stat.number}</h3>

                <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
