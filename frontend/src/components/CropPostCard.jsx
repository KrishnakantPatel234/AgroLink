// src/components/CropPostCard.jsx
import React from "react";
import { API_BASE_URL } from "../api";

const IMAGE_BASE_URL = API_BASE_URL.replace("/api", "");

const CropPostCard = ({
  post,
  onClick,
  showFarmerInfo = false,
  showContactButton = false,
  onContactClick,
}) => {
  if (!post) return null;

  const {
    title,
    cropName,
    quantity,
    price,
    location,
    image,
    createdAt,
    date,
    farmer, // optional: { name, phone }
  } = post;

  const displayTitle = title || cropName || "Crop Post";
  const displayLocation = location || "Location not set";
  const displayDate = new Date(createdAt || date || Date.now()).toLocaleDateString();

  const imageSrc = image
    ? `${IMAGE_BASE_URL}/${image}`
    : "https://via.placeholder.com/300x200?text=Crop"; // fallback

  return (
    <div
      className="bg-white border border-green-50 rounded-xl shadow-sm p-3 flex gap-3 hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="flex-shrink-0">
        <img
          src={imageSrc}
          alt={displayTitle}
          className="w-24 h-24 rounded-lg object-cover border border-green-100"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-1">
            {displayTitle}
          </h3>

          {cropName && (
            <p className="text-xs text-gray-500 mt-0.5">🌾 {cropName}</p>
          )}

          <p className="text-xs text-gray-500">
            📍 {displayLocation}
          </p>

          {showFarmerInfo && farmer && (
            <p className="text-[11px] text-gray-500 mt-1">
              👨‍🌾 {farmer.name} {farmer.phone && `· 📞 ${farmer.phone}`}
            </p>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] text-gray-600">
          <div>
            <span className="mr-2">
              📦 {quantity || 0} KG
            </span>
            <span>💰 ₹{price || 0} / KG</span>
          </div>
          <span className="text-gray-400">📅 {displayDate}</span>
        </div>

        {/* Contact button (for marketplace / buyers) */}
        {showContactButton && (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onContactClick && onContactClick(post);
              }}
              className="px-3 py-1 text-[11px] rounded-lg bg-green-600 text-white shadow hover:bg-green-700 transition"
            >
              📞 Contact Farmer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPostCard;
