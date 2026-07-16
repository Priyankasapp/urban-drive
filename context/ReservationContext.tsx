"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

export interface ReservationData {
  _id?: string;
  reservationRef: string;
  car: any;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  pickup: {
    location: string;
    date: Date;
    time: string;
  };
  dropoff?: {
    location?: string;
    date?: Date;
    time?: string;
  };
  chauffeur: boolean;
  enhancements: {
    conciergeDelivery: boolean;
    platinumInsurance: boolean;
    satelliteConnectivity: boolean;
  };
  pricing: {
    dailyRate: number;
    rentalDays: number;
    subtotal: number;
    tax: number;
    total: number;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ReservationContextType {
  reservations: ReservationData[];
  loading: boolean;
  errorMsg: string;
  setErrorMsg: (msg: string) => void;
  fetchReservations: (email?: string) => Promise<void>;
  createReservation: (data: any) => Promise<boolean>;
  updateReservation: (
    id: string,
    data: Partial<ReservationData>,
  ) => Promise<boolean>;
  deleteReservation: (id: string) => Promise<boolean>;
}

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined,
);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchReservations = useCallback(async (email?: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const url = email
        ? `/api/reservations?email=${encodeURIComponent(email)}`
        : "/api/reservations";
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setReservations(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch reservations");
      }
    } catch (err) {
      console.error("Reservation fetch error:", err);
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = async (data: any): Promise<boolean> => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create reservation");
      }

      await fetchReservations();
      return true;
    } catch (err) {
      console.error("Reservation creation error:", err);
      setErrorMsg((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (
    id: string,
    data: Partial<ReservationData>,
  ): Promise<boolean> => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update reservation");
      }

      await fetchReservations();
      return true;
    } catch (err) {
      console.error("Reservation update error:", err);
      setErrorMsg((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (id: string): Promise<boolean> => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete reservation");
      }

      setReservations((current) => current.filter((res) => res._id !== id));
      return true;
    } catch (err) {
      console.error("Reservation deletion error:", err);
      setErrorMsg((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        loading,
        errorMsg,
        setErrorMsg,
        fetchReservations,
        createReservation,
        updateReservation,
        deleteReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error(
      "useReservations must be consumed downstream from a ReservationProvider",
    );
  }
  return context;
}
