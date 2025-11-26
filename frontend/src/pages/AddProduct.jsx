// frontend/src/pages/AddProduct.jsx
import React, { useState } from "react";
import { postRequest } from "../api";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    pricePerUnit: "",
    unit: "kg",
    quantityAvailable: "",
    village: "",
    district: "",
    state: "",
    description: "",
    imageUrl: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Please login as farmer first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const body = {
        name: form.name,
        category: form.category,
        pricePerUnit: Number(form.pricePerUnit),
        unit: form.unit,
        quantityAvailable: Number(form.quantityAvailable),
        location: {
          village: form.village,
          district: form.district,
          state: form.state,
        },
        description: form.description,
        imageUrl: form.imageUrl,
      };

      await postRequest("/products", body, token);
      setMessage("Product successfully added!");
      setTimeout(() => navigate("/marketplace"), 1000);
    } catch (err) {
      console.error(err);
      setError("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="max-w-md w-full mx-auto px-4 py-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-green-700">
          Add Product (Farmer)
        </h2>

        {message && (
          <p className="mb-3 text-center text-sm text-green-600">{message}</p>
        )}
        {error && (
          <p className="mb-3 text-center text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crop Name
            </label>
            <input
              name="name"
              placeholder="e.g. Wheat / गेहूं"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              name="category"
              placeholder="Grain, Fruit, Vegetable..."
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per unit (₹)
              </label>
              <input
                type="number"
                name="pricePerUnit"
                placeholder="e.g. 50"
                value={form.pricePerUnit}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="kg">kg</option>
                <option value="quintal">quintal</option>
                <option value="litre">litre</option>
                <option value="piece">piece</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity available
            </label>
            <input
              type="number"
              name="quantityAvailable"
              placeholder="e.g. 100"
              value={form.quantityAvailable}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Village
              </label>
              <input
                name="village"
                placeholder="Village"
                value={form.village}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <input
                name="district"
                placeholder="District"
                value={form.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (optional)
            </label>
            <input
              name="imageUrl"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Quality, type, organic, etc."
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-green-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-green-700 disabled:bg-green-400 transition"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
