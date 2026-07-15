"use client";

import { standardsSection } from "@/data/about";

export default function Standards() {
  return (
    <section className="bg-gray-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            {standardsSection.badge}
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {standardsSection.title}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {standardsSection.cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="group rounded-3xl border border-gray-200 bg-white p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:bg-black hover:shadow-2xl"
              >
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 transition-colors duration-500 group-hover:border-white/20">
                  <Icon
                    size={30}
                    className="text-black transition-colors duration-500 group-hover:text-white"
                  />
                </div>

                {/* Content */}
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 transition-colors duration-500 group-hover:text-white">
                    {card.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600 transition-colors duration-500 group-hover:text-gray-300">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
