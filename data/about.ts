import { ShieldCheck, EyeOff, Gauge, CheckCircle2 } from "lucide-react";
import {
  AboutHero,
  StorySection,
  StandardsSection,
  ExperienceSection,
  CTASection,
} from "@/types/about";
export const aboutHero: AboutHero = {
  badge: "Est. 2014",
  title: "The UrbanDrive Philosophy",
  description:
    "Precision engineering meets bespoke service. We provide more than transportation; we deliver an uncompromising standard of executive mobility.",
  button: "Explore Excellence",
  image:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1800&auto=format&fit=crop",
};

export const storySection: StorySection = {
  title: "A Heritage of Curation",
  description: [
    "UrbanDrive began as a private collective of automotive enthusiasts dedicated to the preservation and performance of high-end machinery. What started as a shared passion for precision became the blueprint for a global mobility platform.",

    "Every vehicle in our fleet is hand-selected. We do not just look for specifications; we look for character, heritage, and the tactile sensations that define a premium driving experience.",
  ],
  image:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop",

  stats: [
    {
      number: "50+",
      label: "Handpicked Models",
    },
    {
      number: "12",
      label: "Global Hubs",
    },
  ],
};

export const standardsSection: StandardsSection = {
  badge: "The Standard",
  title: "Foundations of the Brand",

  cards: [
    {
      title: "Curated Excellence",
      description:
        "Every vehicle undergoes a 120-point inspection before entering our premium fleet.",
      icon: ShieldCheck,
    },
    {
      title: "Absolute Discretion",
      description:
        "Private delivery and seamless logistics designed for executives who value privacy.",
      icon: EyeOff,
    },
    {
      title: "Unrivaled Performance",
      description:
        "Experience engineering excellence with vehicles selected for both luxury and performance.",
      icon: Gauge,
    },
  ],
};

export const experienceSection: ExperienceSection = {
  badge: "Command Center",
  title: "Behind the Wheel",

  description:
    "The interior of every UrbanDrive vehicle is designed to be an extension of your workspace, combining technology, craftsmanship, and comfort.",

  image:
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop",

  features: [
    "Bespoke Audio Landscapes",
    "Intelligent Driving Assistance",
    "Ventilated Nappa Leather Seating",
  ],

  icon: CheckCircle2,
};

export const ctaSection: CTASection = {
  title: "Define Your Journey.",
  subtitle: "Luxury is not an option; it is our base state.",
  primaryButton: "Experience the Fleet",
  secondaryButton: "Contact Concierge",
};
