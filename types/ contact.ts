export interface FilterOption {
  label: string;
  value: string;
}

export interface CarsHeroData {
  badge: string;
  title: string;
  subtitle: string;
}

export interface Car {
  id: number;
  name: string;
  type: string;
  category: string;
  brand: string;
  hp: number;
  acceleration: string;
  transmission: string;
  price: number;
  imageUrl: string;
  status: "Available Now" | "Reserved" | "New Arrival";
}

// Your existing contact interface types remain below...
export interface ContactHero {
  badge: string;
  title: string;
  description: string;
  image: string;
  primaryButton: string;
  secondaryButton: string;
}
