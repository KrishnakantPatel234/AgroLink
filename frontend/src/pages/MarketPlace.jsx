// frontend/src/pages/Marketplace.jsx
import React, { useEffect, useState } from "react";
import { getRequest } from "../api";
import { useNavigate } from "react-router-dom";
import CropPostCard from "../components/CropPostCard";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (district) params.append("district", district);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const queryString = params.toString();
      const url = queryString ? `/products?${queryString}` : "/products";

      const data = await getRequest(url);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Data laane me problem aa rahi hai.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // contact farmer logic – sirf buyer login hone par
  const handleContactFarmer = (product) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("Please login as a buyer to contact the farmer.");
      navigate("/login");
      return;
    }

    if (role !== "buyer") {
      alert("Only registered buyers can contact farmers.");
      return;
    }

    alert(
      `Buyer contact flow yahan aayega.\nFarmer: ${
        product.farmer?.name || "Unknown"
      }\nPhone: ${product.farmer?.phone || "Not shared"}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-green-700">
          BharatKrishi Marketplace
        </h2>

        {/* Filters */}
        <form
          onSubmit={handleFilterSubmit}
          className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-6 mb-6"
        >
          <input
            type="text"
            placeholder="Crop (e.g. Wheat)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="col-span-2 md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="col-span-2 md:col-span-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition"
          >
            Filter
          </button>
        </form>

        {loading && (
          <p className="text-center text-gray-600 mb-4">Loading...</p>
        )}
        {error && (
          <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
        )}

        {/* ✅ Single grid, proper stretching, no nesting */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {products.map((p) => (
            <CropPostCard
              key={p._id}
              product={p}
              showFarmerInfo={!!p.farmer}
              showContactButton={true}
              onContactClick={handleContactFarmer}
              className="h-full"
            />
          ))}
        </div>

        {!loading && !error && products.length === 0 && (
          <p className="mt-6 text-center text-gray-600">
            Abhi koi product nahi mila.
          </p>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
