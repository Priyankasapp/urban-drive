"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import {
  type CarData,
  type CarUpdateData,
  useCars,
} from "@/context/CarContext";

interface EditCarModalProps {
  car: CarData | null;
  onClose: () => void;
}

function createFormData(car: CarData): CarUpdateData {
  return {
    name: car.name,
    pricePerDay: car.pricePerDay,
    transmission: car.transmission,
    fuelType: car.fuelType,
    seats: car.seats,
    horsepower: car.horsepower,
    acceleration: car.acceleration,
    description: car.description,
    status: car.status,
  };
}

export default function EditCarModal({ car, onClose }: EditCarModalProps) {
  const { updateCar, loading, errorMsg } = useCars();
  const [formData, setFormData] = useState<CarUpdateData | null>(() =>
    car ? createFormData(car) : null,
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  if (!car || !formData) return null;

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = event.target;
    const numericFields = ["pricePerDay", "seats", "horsepower"];

    setFormData((current) =>
      current
        ? {
            ...current,
            [id]: numericFields.includes(id) ? Number(value) : value,
          }
        : current,
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (await updateCar(car._id, formData, selectedFiles)) {
      onClose();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setSelectedFiles((current) => [...current, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result;
        if (typeof preview === "string") {
          setImagePreviews((current) => [...current, preview]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedFiles((current) => current.filter((_, item) => item !== index));
    setImagePreviews((current) => current.filter((_, item) => item !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close edit car dialog"
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-canvas/10 bg-ink/95 p-6 text-canvas shadow-xl md:p-8">
        <header className="mb-6 flex items-start justify-between border-b border-canvas/10 pb-4">
          <div>
            <h2 className="text-xl font-semibold">Edit fleet asset</h2>
            <p className="mt-0.5 text-xs text-canvas/50">
              Update the details for {car.name}.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close edit car dialog"
            onClick={onClose}
            className="text-canvas/60 transition hover:text-canvas"
          >
            <X size={20} />
          </button>
        </header>

        {errorMsg && (
          <div className="mb-5 rounded-lg border border-red-500/30 bg-red-900/40 p-3 text-xs text-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {car.images[0] && (
            <div className="relative h-40 overflow-hidden rounded-lg border border-canvas/10">
              <Image
                src={car.images[0]}
                alt={car.name}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-3 rounded-lg border border-dashed border-canvas/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-canvas/70">
                  Replace images
                </p>
                <p className="mt-1 text-xs text-canvas/45">
                  New images replace the current image gallery when saved.
                </p>
              </div>
              <label className="cursor-pointer rounded-lg border border-canvas/15 px-3 py-2 text-xs font-semibold transition hover:bg-canvas/10">
                <span className="flex items-center gap-2">
                  <Upload size={14} /> Choose images
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="relative aspect-video overflow-hidden rounded-lg border border-canvas/10 bg-canvas/5"
                    style={{
                      backgroundImage: `url(${preview})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <button
                      type="button"
                      aria-label="Remove selected image"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-ink/80 p-1 text-canvas hover:bg-ink"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Name"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Field
              label="Daily price ($)"
              id="pricePerDay"
              type="number"
              min="1"
              value={formData.pricePerDay}
              onChange={handleChange}
            />
            <Field
              label="Horsepower"
              id="horsepower"
              type="number"
              min="1"
              value={formData.horsepower}
              onChange={handleChange}
            />
            <Field
              label="0–60 mph"
              id="acceleration"
              value={formData.acceleration}
              onChange={handleChange}
            />
            <Field
              label="Seats"
              id="seats"
              type="number"
              min="1"
              value={formData.seats}
              onChange={handleChange}
            />
            <SelectField
              label="Transmission"
              id="transmission"
              value={formData.transmission}
              onChange={handleChange}
              options={["Automatic", "Manual"]}
            />
            <SelectField
              label="Fuel type"
              id="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              options={[
                "Premium Gasoline",
                "Electric (BEV)",
                "Hybrid",
                "Diesel",
              ]}
            />
            <SelectField
              label="Status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                "available",
                "booked",
                "maintenance",
                "reserved",
                "new",
              ]}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-[10px] font-semibold uppercase text-canvas/60"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="resize-none rounded-lg border border-canvas/10 bg-canvas/5 px-4 py-2.5 text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2.5 text-xs font-semibold text-canvas/70 transition hover:text-canvas disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-signal px-4 py-2.5 text-xs font-semibold text-ink transition hover:bg-signal/90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  id: keyof CarUpdateData;
  value: string | number;
  type?: "text" | "number";
  min?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Field({ label, id, value, type = "text", min, onChange }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[10px] font-semibold uppercase text-canvas/60"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        min={min}
        value={value}
        onChange={onChange}
        required
        className="rounded-lg border border-canvas/10 bg-canvas/5 px-4 py-2.5 text-sm outline-none"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  id: "transmission" | "fuelType" | "status";
  value: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function SelectField({
  label,
  id,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[10px] font-semibold uppercase text-canvas/60"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="rounded-lg border border-canvas/10 bg-ink px-4 py-2.5 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
