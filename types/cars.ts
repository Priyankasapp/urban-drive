export interface CarSpec {
  label: string;
  value: string;
}

export interface Car {
  id: string;
  name: string;
  slug: string;

  brand: string;
  category: string;

  image: string;

  horsepower: number;
  acceleration: string;
  transmission: "Automatic" | "Manual";

  dailyPrice: number;

  status: "available" | "reserved" | "new";

  specs: CarSpec[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface CarsHeroData {
  badge: string;
  title: string;
  subtitle: string;
}
