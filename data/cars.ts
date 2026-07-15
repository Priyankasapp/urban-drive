import { Car, CarsHeroData, FilterOption } from "@/types/cars";

export const carsHero: CarsHeroData = {
  badge: "Executive Selection",

  title: "Explore Our Fleet",

  subtitle:
    "Discover luxury, performance, and elegance with our exclusive collection.",
};

export const brands: FilterOption[] = [
  { label: "Porsche", value: "porsche" },
  { label: "Range Rover", value: "range-rover" },
  { label: "BMW", value: "bmw" },
  { label: "Mercedes", value: "mercedes" },
  { label: "Audi", value: "audi" },
];

export const categories: FilterOption[] = [
  { label: "Sports", value: "sports" },
  { label: "SUV", value: "suv" },
  { label: "Electric", value: "electric" },
  { label: "Luxury", value: "luxury" },
];

export const transmissions: FilterOption[] = [
  {
    label: "Automatic",
    value: "Automatic",
  },
  {
    label: "Manual",
    value: "Manual",
  },
];

export const cars: Car[] = [];
