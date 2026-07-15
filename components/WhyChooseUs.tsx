"use client";

import React from "react";
import { CheckCircle2, Zap, PhoneCall } from "lucide-react";

interface FeatureItem {
  icon: "verified" | "speed" | "support_agent";
  title: string;
  description: string;
}

const iconMap = {
  verified: CheckCircle2,
  speed: Zap,
  support_agent: PhoneCall,
};

const features: FeatureItem[] = [
  {
    icon: "verified",
    title: "Curated Excellence",
    description:
      "Every vehicle in our fleet undergoes a rigorous 200-point inspection before every delivery.",
  },
  {
    icon: "speed",
    title: "Instant Approval",
    description:
      "Our advanced vetting system means you can be behind the wheel in under 15 minutes.",
  },
  {
    icon: "support_agent",
    title: "24/7 Concierge",
    description:
      "A dedicated specialist is available round-the-clock for any request during your rental period.",
  },
];

export default function WhyChooseUs(): React.JSX.Element {
  return (
    <section className="py-32 bg-[var(--background)] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--outline)]">
            Our Standard
          </span>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)] mt-1 mb-4">
            The UrbanDrive Advantage
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            We redefine car rental through a white-glove service model built on
            transparency and speed.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-16">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Circular Icon Badge */}
                <div className="w-16 h-16 rounded-full border border-[var(--border)] flex items-center justify-center mb-6 bg-[var(--surface-container-lowest)] text-[var(--text-primary)]">
                  <IconComponent size={24} className="stroke-[1.5]" />
                </div>

                {/* Feature Text */}
                <h4 className="font-semibold text-lg text-[var(--text-primary)] mb-3">
                  {feature.title}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
