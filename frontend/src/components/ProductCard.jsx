// frontend/src/components/ProductCard.jsx
import React from "react";

const ProductCard = ({ product, onContact }) => {
  const p = product;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {p.imageUrl && (
        <img
          src={p.imageUrl}
          alt={p.name}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-4 flex flex-col gap-1 text-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {p.name}
        </h3>

        <p className="text-gray-600">
          <span className="font-medium">Category:</span> {p.category}
        </p>

        <p className="text-gray-800">
          <span className="font-medium">Price:</span> ₹{p.pricePerUnit} /{" "}
          {p.unit}
        </p>

        <p className="text-gray-700">
          <span className="font-medium">Available:</span>{" "}
          {p.quantityAvailable} {p.unit}
        </p>

        <p className="text-gray-600">
          <span className="font-medium">Location:</span>{" "}
          {p.location?.village || "-"},{" "}
          {p.location?.district || "-"},{" "}
          {p.location?.state || "-"}
        </p>

        {p.farmer && (
          <p className="text-gray-700 mt-1">
            <span className="font-medium">Farmer:</span> {p.farmer.name}
          </p>
        )}

        {/* Contact button – public listing but action only via buyer */}
        {p.farmer && onContact && (
          <button
            onClick={() => onContact(p)}
            className="mt-3 w-full bg-green-600 text-white text-sm py-2 rounded-md hover:bg-green-700 transition"
          >
            Contact Farmer
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
