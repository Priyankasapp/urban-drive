export interface CarSpec {
  label: string;
  value: string;
}

export interface Car {
  id: string;
  category: string;
  imageSrc: string;
  name: string;
  tagline: string;
  pricePerDay: number;
  specs: CarSpec[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}
export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}
