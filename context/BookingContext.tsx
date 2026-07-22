// context/BookingContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

// ---------- Types ----------

interface SelectedCar {
  _id: string;
  name: string;
  slug: string;
  pricePerDay: number;
  images: string[];
}

interface PickupDetails {
  location: string;
  date: string; // ISO string, easiest to store/pass around
  time: string;
}

interface DropoffDetails {
  location?: string;
  date?: string;
  time?: string;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

interface Enhancements {
  conciergeDelivery: boolean;
  platinumInsurance: boolean;
  satelliteConnectivity: boolean;
}

interface BookingState {
  car: SelectedCar | null;
  pickup: PickupDetails | null;
  dropoff: DropoffDetails | null;
  chauffeur: boolean;
  enhancements: Enhancements;
  customer: CustomerDetails | null;
  notes?: string | undefined;
}

interface BookingContextValue extends BookingState {
  setCar: (car: SelectedCar) => void;
  setPickup: (pickup: PickupDetails) => void;
  setDropoff: (dropoff: DropoffDetails) => void;
  setChauffeur: (value: boolean) => void;
  setEnhancements: (enhancements: Partial<Enhancements>) => void;
  setCustomer: (customer: CustomerDetails) => void;
  setNotes: (notes: string) => void;
  estimatedTotal: number | null;
  resetBooking: () => void;
}

// ---------- Defaults ----------

const initialState: BookingState = {
  car: null,
  pickup: null,
  dropoff: null,
  chauffeur: false,
  enhancements: {
    conciergeDelivery: false,
    platinumInsurance: true,
    satelliteConnectivity: false,
  },
  customer: null,
  notes: undefined,
};

const BookingContext = createContext<BookingContextValue | undefined>(
  undefined,
);

// ---------- Provider ----------

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  // Wrap all state changers in useCallback so their references remain stable
  const setCar = useCallback((car: SelectedCar) => {
    setState((prev) => ({ ...prev, car }));
  }, []);

  const setPickup = useCallback((pickup: PickupDetails) => {
    setState((prev) => ({ ...prev, pickup }));
  }, []);

  const setDropoff = useCallback((dropoff: DropoffDetails) => {
    setState((prev) => ({ ...prev, dropoff }));
  }, []);

  const setChauffeur = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, chauffeur: value }));
  }, []);

  const setEnhancements = useCallback((enhancements: Partial<Enhancements>) => {
    setState((prev) => ({
      ...prev,
      enhancements: { ...prev.enhancements, ...enhancements },
    }));
  }, []);

  const setCustomer = useCallback((customer: CustomerDetails) => {
    setState((prev) => ({ ...prev, customer }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setState((prev) => ({ ...prev, notes }));
  }, []);

  const resetBooking = useCallback(() => {
    setState(initialState);
  }, []);

  // Rough client-side estimate only — the API route recalculates
  // the real total server-side, so this is just for display before submit.
  const estimatedTotal = useMemo(() => {
    if (!state.car || !state.pickup) return null;

    const pickupDate = new Date(state.pickup.date);
    const dropoffDate = state.dropoff?.date
      ? new Date(state.dropoff.date)
      : pickupDate;

    const msPerDay = 1000 * 60 * 60 * 24;
    const rentalDays = Math.max(
      Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / msPerDay),
      1,
    );

    const subtotal = state.car.pricePerDay * rentalDays;
    const tax = subtotal * 0.08;
    return Math.round((subtotal + tax) * 100) / 100;
  }, [state.car, state.pickup, state.dropoff]);

  // Completely memoize the context values object instance
  const value: BookingContextValue = useMemo(
    () => ({
      ...state,
      setCar,
      setPickup,
      setDropoff,
      setChauffeur,
      setEnhancements,
      setCustomer,
      setNotes,
      estimatedTotal,
      resetBooking,
    }),
    [
      state,
      setCar,
      setPickup,
      setDropoff,
      setChauffeur,
      setEnhancements,
      setCustomer,
      setNotes,
      estimatedTotal,
      resetBooking,
    ],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

// ---------- Hook ----------

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
