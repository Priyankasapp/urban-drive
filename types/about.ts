import { LucideIcon } from "lucide-react";

export interface AboutHero {
  badge: string;
  title: string;
  description: string;
  button: string;
  image: string;
}

export interface StoryStat {
  number: string;
  label: string;
}

export interface StorySection {
  title: string;
  description: string[];
  image: string;
  stats: StoryStat[];
}

export interface StandardCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface StandardsSection {
  badge: string;
  title: string;
  cards: StandardCard[];
}

export interface ExperienceSection {
  badge: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  icon: LucideIcon;
}

export interface CTASection {
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
}
