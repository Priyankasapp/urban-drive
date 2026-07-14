"use client";

import { useState } from "react";
import { Upload, ArrowRight, X } from "lucide-react";

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCarModal({ isOpen, onClose }: AddCarModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => setImagePreview(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Ambient Glass Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Main Glassmorphic Modal Content Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-ink/80 backdrop-blur-xl border border-canvas/10 text-canvas rounded-xl shadow-2xl p-6 md:p-8 z-10 animate-fade-in flex flex-col gap-6">
        {/* Modal Header */}
        <header className="flex items-center justify-between pb-4 border-b border-canvas/5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Add New Fleet Asset
            </h2>
            <p className="text-xs text-canvas/50 mt-0.5">
              Register a high-performance vehicle into the global system.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-canvas/10 text-canvas/60 hover:text-canvas transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* Form Element */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Media Upload Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-canvas/60 uppercase block">
              Vehicle Imagery
            </label>
            <div className="relative border border-dashed border-canvas/20 rounded-xl bg-canvas/[0.02] hover:bg-canvas/[0.04] transition-colors duration-200">
              {!imagePreview ? (
                <label
                  htmlFor="modal-image-upload"
                  className="flex flex-col items-center justify-center p-6 cursor-pointer gap-2"
                >
                  <div className="p-2.5 bg-canvas/10 rounded-full border border-canvas/10 text-canvas">
                    <Upload size={18} />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-medium block">
                      Click to upload vehicle photo
                    </span>
                    <span className="text-[10px] text-canvas/40 block mt-0.5">
                      High res PNG or JPG
                    </span>
                  </div>
                  <input
                    id="modal-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative w-full h-48 rounded-xl overflow-hidden p-1 bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Vehicle Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="brand"
                className="text-[10px] font-semibold tracking-wider text-canvas/60 uppercase"
              >
                Brand / Manufacturer
              </label>
              <input
                id="brand"
                type="text"
                placeholder="Porsche"
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 focus:border-signal outline-none rounded-lg text-sm transition"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="model"
                className="text-[10px] font-semibold tracking-wider text-canvas/60 uppercase"
              >
                Model
              </label>
              <input
                id="model"
                type="text"
                placeholder="911 GT3"
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 focus:border-signal outline-none rounded-lg text-sm transition"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="year"
                className="text-[10px] font-semibold tracking-wider text-canvas/60 uppercase"
              >
                Production Year
              </label>
              <input
                id="year"
                type="number"
                placeholder="2026"
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 focus:border-signal outline-none rounded-lg text-sm transition"
                required
              />
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="category"
                className="text-[10px] font-semibold tracking-wider text-canvas/60 uppercase"
              >
                Category
              </label>
              <select
                id="category"
                className="px-4 py-2.5 bg-ink border border-canvas/10 focus:border-signal outline-none rounded-lg text-sm transition"
              >
                <option value="luxury">Luxury Sedan</option>
                <option value="suv">Premium SUV</option>
                <option value="exotic">Exotic / Sports</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="transmission"
                className="text-[10px] font-semibold tracking-wider text-canvas/60 uppercase"
              >
                Transmission
              </label>
              <select
                id="transmission"
                className="px-4 py-2.5 bg-ink border border-canvas/10 focus:border-signal outline-none rounded-lg text-sm transition"
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="fuel"
                className="text-[10px] font-semibold tracking-wider text-canvas/60 uppercase"
              >
                Fuel/Power Station
              </label>
              <select
                id="fuel"
                className="px-4 py-2.5 bg-ink border border-canvas/10 focus:border-signal outline-none rounded-lg text-sm transition"
              >
                <option value="electric">Electric (BEV)</option>
                <option value="petrol">Premium Gasoline</option>
              </select>
            </div>
          </div>

          {/* Pricing & Logistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="seats"
                className="text-[10px] font-semibold tracking-wider text-canvas/60 uppercase"
              >
                Seating Capacity
              </label>
              <input
                id="seats"
                type="number"
                placeholder="2"
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 focus:border-signal outline-none rounded-lg text-sm transition"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="location"
                className="text-[10px] font-semibold tracking-wider text-canvas/60 uppercase"
              >
                Hub Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="LAX Terminal"
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 focus:border-signal outline-none rounded-lg text-sm transition"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="price"
                className="text-[10px] font-semibold tracking-wider text-canvas/60 uppercase"
              >
                Daily Rate ($ USD)
              </label>
              <input
                id="price"
                type="number"
                placeholder="255"
                className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 focus:border-signal outline-none rounded-lg text-sm transition"
                required
              />
            </div>
          </div>

          {/* Description Block */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-[10px] font-semibold tracking-wider text-canvas/60 uppercase"
            >
              Asset Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Outline high-end options, tracking telemetry packages..."
              className="px-4 py-2.5 bg-canvas/5 border border-canvas/10 focus:border-signal outline-none rounded-lg text-sm transition resize-none"
              required
            />
          </div>

          {/* Submit Actions Button block */}
          <div className="flex justify-end gap-3 pt-4 border-t border-canvas/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase hover:bg-canvas/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-canvas text-ink hover:bg-canvas/90 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all duration-300 active:scale-95 shadow-md"
            >
              Deploy Asset
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
