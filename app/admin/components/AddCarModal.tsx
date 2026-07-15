"use client";

import { useState } from "react";
import { Upload, ArrowRight, X } from "lucide-react";
import { useCars, CarFormData } from "@/context/CarContext";

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddCarModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCarModalProps) {
  // Pull centralized states and mutation controllers directly from our context engine
  const { addNewCar, loading, errorMsg, setErrorMsg } = useCars();

  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
    category: "Exotic / Sports",
    transmission: "Automatic",
    fuelType: "Premium Gasoline",
    seats: "2",
    horsepower: "",
    acceleration: "",
    location: "",
    pricePerDay: "",
    description: "",
    status: "available",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...fileArray]);

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImagePreviews((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fire the form data context action handler
    const isSuccess = await addNewCar(formData, selectedFiles);

    if (isSuccess) {
      // Flush client data buffers entirely upon verified DB transaction success
      setSelectedFiles([]);
      setImagePreviews([]);
      setFormData({
        brand: "",
        model: "",
        category: "Exotic / Sports",
        transmission: "Automatic",
        fuelType: "Premium Gasoline",
        seats: "2",
        horsepower: "",
        acceleration: "",
        location: "",
        pricePerDay: "",
        description: "",
        status: "available",
      });

      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay layer */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-ink/80 backdrop-blur-xl border border-canvas/10 text-canvas rounded-xl p-6 md:p-8 z-10 flex flex-col gap-6">
        <header className="flex items-center justify-between pb-4 border-b border-canvas/5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Add New Fleet Asset
            </h2>
            <p className="text-xs text-canvas/50 mt-0.5">
              Asset registration pipelined through CarContext.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-canvas/60 hover:text-canvas"
          >
            <X size={20} />
          </button>
        </header>

        {/* Dynamic Context Error Messages Banner */}
        {errorMsg && (
          <div className="p-3 text-xs bg-red-900/40 border border-red-500/30 text-red-200 rounded-lg flex items-center justify-between">
            <span>⚠️ {errorMsg}</span>
            <button
              type="button"
              onClick={() => setErrorMsg("")}
              className="text-red-200/60 hover:text-red-200"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Upload Area */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-canvas/60 block">
              Vehicle Imagery ({imagePreviews.length} selected)
            </label>
            <div className="border border-dashed border-canvas/20 rounded-xl bg-canvas/[0.02] hover:bg-canvas/[0.04]">
              <label
                htmlFor="ctx-file-upload"
                className="flex flex-col items-center justify-center p-6 cursor-pointer gap-2"
              >
                <Upload size={18} />
                <span className="text-xs font-medium">
                  Click to select photos
                </span>
                <input
                  id="ctx-file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 bg-black/20 rounded-xl border border-canvas/5">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden border border-canvas/10 group"
                  >
                    <img
                      src={preview}
                      alt="Upload preview grid"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-600 rounded-full text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Model Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="brand"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                Brand
              </label>
              <input
                id="brand"
                type="text"
                placeholder="Porsche"
                value={formData.brand}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 rounded-lg text-sm outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="model"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                Model
              </label>
              <input
                id="model"
                type="text"
                placeholder="Cayman GT4"
                value={formData.model}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 rounded-lg text-sm outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="status"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-ink border border-canvas/10 rounded-lg text-sm outline-none"
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Classification Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="category"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-ink border border-canvas/10 rounded-lg text-sm outline-none"
              >
                <option value="Exotic / Sports">Exotic / Sports</option>
                <option value="Premium SUV">Premium SUV</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="transmission"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                Transmission
              </label>
              <select
                id="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-ink border border-canvas/10 rounded-lg text-sm outline-none"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="fuelType"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                Power Train
              </label>
              <select
                id="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-ink border border-canvas/10 rounded-lg text-sm outline-none"
              >
                <option value="Premium Gasoline">Premium Gasoline</option>
                <option value="Electric (BEV)">Electric (BEV)</option>
              </select>
            </div>
          </div>

          {/* Engine Power Matrices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="horsepower"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                Horsepower
              </label>
              <input
                id="horsepower"
                type="number"
                placeholder="414"
                value={formData.horsepower}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 rounded-lg text-sm outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="acceleration"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                0-60 mph
              </label>
              <input
                id="acceleration"
                type="text"
                placeholder="3.7s"
                value={formData.acceleration}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 rounded-lg text-sm outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="seats"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                Seats
              </label>
              <input
                id="seats"
                type="number"
                value={formData.seats}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 rounded-lg text-sm outline-none"
                required
              />
            </div>
          </div>

          {/* Logistic Values Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="location"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                Hub Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="Miami Center"
                value={formData.location}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 rounded-lg text-sm outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pricePerDay"
                className="text-[10px] font-semibold text-canvas/60 uppercase"
              >
                Daily Price ($)
              </label>
              <input
                id="pricePerDay"
                type="number"
                placeholder="249"
                value={formData.pricePerDay}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 rounded-lg text-sm outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-[10px] font-semibold text-canvas/60 uppercase"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={2}
              placeholder="Performance metrics details..."
              value={formData.description}
              onChange={handleInputChange}
              className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 rounded-lg text-sm outline-none resize-none"
              required
            />
          </div>

          {/* Actions Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-canvas/5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-xs font-semibold uppercase hover:bg-canvas/5 rounded-lg disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-canvas text-ink rounded-lg text-xs font-semibold uppercase flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Deploying..." : "Deploy Asset"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
