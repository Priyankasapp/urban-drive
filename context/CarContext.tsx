"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

// Structure reflecting all data inputs needed for form payload validation
export interface CarFormData {
  brand: string;
  model: string;
  category: string;
  transmission: string;
  fuelType: string;
  seats: string;
  horsepower: string;
  acceleration: string;
  location: string;
  pricePerDay: string;
  description: string;
  status: string;
}

// Structure for the populated documents fetched from MongoDB
export interface CarData {
  _id: string;
  name: string;
  brand: { _id: string; name: string } | string;
  category: { _id: string; name: string } | string;
  location: { _id: string; name: string } | string;
  pricePerDay: number;
  transmission: string;
  fuelType: string;
  seats: number;
  horsepower: number;
  acceleration: string;
  images: string[];
  description: string;
  status: string;
  slug: string;
  createdAt: string;
}

export interface CarUpdateData {
  name: string;
  pricePerDay: number;
  transmission: string;
  fuelType: string;
  seats: number;
  horsepower: number;
  acceleration: string;
  description: string;
  status: string;
}

interface CarContextType {
  cars: CarData[];
  loading: boolean;
  deletingCarId: string | null;
  errorMsg: string;
  setErrorMsg: (msg: string) => void;
  fetchCars: () => Promise<void>;
  addNewCar: (formData: CarFormData, files: File[]) => Promise<boolean>;
  updateCar: (
    carId: string,
    data: CarUpdateData,
    files?: File[],
  ) => Promise<boolean>;
  deleteCar: (carId: string) => Promise<boolean>;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export function CarProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Centralized vehicle loading mechanic
  const fetchCars = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/cars");
      const result = await response.json();

      if (result.success) {
        setCars(result.data);
      } else {
        throw new Error(result.message || "Failed to sync fleet records.");
      }
    } catch (err) {
      console.error("Context Fleet Synchronization Failure:", err);
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch all cars safely when the provider mounts
  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      // By putting this execution flow inside an async task queue frame,
      // React can safely commit the initial UI before state changes start.
      if (active) {
        await fetchCars();
      }
    };

    loadInitialData();

    // Cleanup subscription tracker to prevent memory updates on dead components
    return () => {
      active = false;
    };
  }, [fetchCars]);

  // 3. Form upload submission processor
  const addNewCar = async (
    formData: CarFormData,
    files: File[],
  ): Promise<boolean> => {
    setLoading(true);
    setErrorMsg("");

    if (files.length === 0) {
      setErrorMsg("Please select at least one visual asset to deploy.");
      setLoading(false);
      return false;
    }

    try {
      const fullVehicleName = `${formData.brand} ${formData.model}`.trim();

      const dataPayload = new FormData();
      dataPayload.append("name", fullVehicleName);
      dataPayload.append("brand", formData.brand);
      dataPayload.append("category", formData.category);
      dataPayload.append("location", formData.location);
      dataPayload.append("pricePerDay", formData.pricePerDay);
      dataPayload.append("transmission", formData.transmission);
      dataPayload.append("fuelType", formData.fuelType);
      dataPayload.append("seats", formData.seats);
      dataPayload.append("horsepower", formData.horsepower);
      dataPayload.append("acceleration", formData.acceleration);
      dataPayload.append("description", formData.description);
      dataPayload.append("status", formData.status);

      files.forEach((file) => {
        dataPayload.append("images", file);
      });

      const response = await fetch("/api/cars", {
        method: "POST",
        body: dataPayload,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to deploy vehicle asset.");
      }

      await fetchCars();
      return true;
    } catch (err) {
      console.error("Context Data Submission Failure:", err);
      setErrorMsg(
        (err as Error).message || "An unexpected system error occurred.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (carId: string): Promise<boolean> => {
    setDeletingCarId(carId);
    setErrorMsg("");

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete car.");
      }

      // The API soft-deletes the car; remove it from the visible local fleet.
      setCars((currentCars) => currentCars.filter((car) => car._id !== carId));
      return true;
    } catch (err) {
      console.error("Context Car Deletion Failure:", err);
      setErrorMsg(err instanceof Error ? err.message : "Unable to delete car.");
      return false;
    } finally {
      setDeletingCarId(null);
    }
  };

  const updateCar = async (
    carId: string,
    data: CarUpdateData,
    files: File[] = [],
  ): Promise<boolean> => {
    setLoading(true);
    setErrorMsg("");

    try {
      const hasNewImages = files.length > 0;
      const body = hasNewImages
        ? (() => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
              formData.append(key, String(value));
            });
            files.forEach((file) => formData.append("images", file));
            return formData;
          })()
        : JSON.stringify(data);
      const response = hasNewImages
        ? await fetch(`/api/cars/${carId}`, { method: "PUT", body })
        : await fetch(`/api/cars/${carId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body,
          });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update car.");
      }

      await fetchCars();
      return true;
    } catch (err) {
      console.error("Context Car Update Failure:", err);
      setErrorMsg(err instanceof Error ? err.message : "Unable to update car.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        loading,
        deletingCarId,
        errorMsg,
        setErrorMsg,
        fetchCars,
        addNewCar,
        updateCar,
        deleteCar,
      }}
    >
      {children}
    </CarContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error(
      "useCars must be consumed downstream from a CarProvider context element.",
    );
  }
  return context;
}
