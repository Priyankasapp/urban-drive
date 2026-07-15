import { LucideIcon } from "lucide-react";

export interface ContactHero {
  badge: string;
  title: string;
  description: string;
  image: string;
  primaryButton: string;
  secondaryButton: string;
}

export interface ContactCard {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export interface ContactInfoSection {
  title: string;
  subtitle: string;
  cards: ContactCard[];
}

export interface ContactFormSection {
  title: string;
  subtitle: string;
  image: string;
  services: string[];
}

export interface OfficeLocation {
  badge: string;
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  badge: string;
  title: string;
  faqs: FAQItem[];
}

export interface ContactCTA {
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
}
