// src/components/CropPostCard.jsx
import React from "react";
import { API_BASE_URL } from "../api";

const IMAGE_BASE_URL = API_BASE_URL.replace("/api", "");

const CropPostCard = ({
  product,
  showFarmerInfo = false,
  showContactButton = false,
  onContactClick,
  onClick,
  className = "",
}) => {
  if (!product) return null;

  // ---------- DATA MAPPING ----------
  const title =
    product.title ||
    product.name ||
    product.cropName ||
    "Crop Post";

  const cropName = product.cropName || product.name || "";

  const quantity =
    product.quantityAvailable ??
    product.quantity ??
    0;

  const unit = product.unit || "";

  const price =
    product.pricePerUnit ??
    product.price ??
    0;

  const locationText =
  typeof product.location === "string" && product.location.trim()
    ? product.location.trim()
    : "Location not set";


  const description = product.description || "";

  const displayDate = new Date(
    product.createdAt || product.date || Date.now()
  ).toLocaleDateString();

  const rawImage = product.imageUrl || product.image;
  let imageSrc = null;
  if (rawImage) {
    if (rawImage.startsWith("http")) {
      imageSrc = rawImage;
    } else {
      const cleanPath = rawImage.replace(/^\/+/, "");
      imageSrc = `${IMAGE_BASE_URL}/${cleanPath}`;
    }
  }

  const farmer = product.farmer;

  // ---------- UI ----------
  return (
    <div
      onClick={onClick}
      className={`
        w-full
        bg-white
        rounded-3xl
        shadow-lg
        border border-green-100
        overflow-hidden
        flex flex-col
        min-h-[360px]        /* 🔹 bada, roomy card */
        hover:shadow-xl hover:-translate-y-1.5
        transition
        cursor-pointer
        ${className}
      `}
    >
      {/* TOP: IMAGE */}
      <div className="w-full h-40 md:h-44 bg-gray-50 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-green-50 via-green-100 to-green-50 flex items-center justify-center text-sm text-green-700 font-medium">
            No image available
          </div>
        )}
      </div>

      {/* BOTTOM: CONTENT */}
      <div className="flex-1 flex flex-col justify-between p-4 md:p-5 text-xs md:text-sm">
        <div className="space-y-2">
          {/* Title + price */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                {title}
              </h3>
              {cropName && (
                <p className="text-[11px] md:text-xs text-gray-500 mt-0.5 truncate">
                  🌾 {cropName}
                </p>
              )}
            </div>

            <div className="shrink-0 bg-green-50 text-green-700 text-[11px] md:text-xs px-3 py-1.5 rounded-2xl font-semibold text-right">
              ₹{price || 0}
              {unit ? ` / ${unit}` : ""}
            </div>
          </div>

          {/* Location + quantity */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-[11px] md:text-xs text-gray-700 max-w-[60%]">
              📍
              <span className="truncate">{locationText}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-[11px] md:text-xs text-green-700 font-medium">
              📦 {quantity} {unit}
            </span>
          </div>

          {/* Description – zyada space */}
          <p className="mt-2 text-[11px] md:text-xs text-gray-700 leading-relaxed max-h-20 overflow-hidden">
            {description || "No description added."}
          </p>
        </div>

        {/* Bottom row */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            {showFarmerInfo && farmer && (
              <p className="text-[11px] md:text-xs text-gray-600 truncate">
                👨‍🌾 {farmer.name}
                {farmer.phone && ` · 📞 ${farmer.phone}`}
              </p>
            )}
            {!showFarmerInfo && (
              <p className="text-[11px] md:text-xs text-gray-400">
                📅 {displayDate}
              </p>
            )}
          </div>

          {showFarmerInfo && (
            <span className="hidden sm:inline text-[11px] text-gray-400 mr-1">
              📅 {displayDate}
            </span>
          )}

          {showContactButton && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onContactClick && onContactClick(product);
              }}
              className="px-3 md:px-4 py-1.5 text-[11px] md:text-xs rounded-lg bg-green-600 text-white shadow-sm hover:bg-green-700 active:scale-95 transition"
            >
              📞 Contact
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropPostCard;
