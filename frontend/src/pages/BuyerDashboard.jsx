import React, { useEffect, useState } from "react";
import { getRequest } from "../api";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Future: API se aayega
  const [savedCrops, setSavedCrops] = useState([]);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Buyer";
  const role = localStorage.getItem("role");

  // Simple role safety – ideally RequireRole("buyer") already laga ho
  useEffect(() => {
    if (role !== "buyer") {
      navigate("/login");
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        setError("");

        // Abhi ke liye simple: /products se kuch top items
        const data = await getRequest("/products");
        const list = Array.isArray(data) ? data : [];

        // Just pick first 6 as "recommended"
        setRecommended(list.slice(0, 6));
      } catch (err) {
        console.error("Error loading recommended products:", err);
        setError("Recommended deals load karne me problem aa rahi hai.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  const handleContactFromDashboard = (product) => {
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

    // Yahan se future me: chat / order page
    alert(
      `Contact flow from dashboard.\nFarmer: ${product.farmer?.name}\nPhone: ${product.farmer?.phone || "Not shared"}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome, <span className="text-green-700">{userName}</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Buyer dashboard – yahan aap apne liye best fasal deals dekh sakte
              hain.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/marketplace")}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              🔍 Go to Marketplace
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
            <p className="text-xs text-gray-500">Saved Crops</p>
            <p className="text-xl font-bold text-gray-800">
              {savedCrops.length}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Faslon ko save karke baad me easily compare karein.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
            <p className="text-xs text-gray-500">Orders</p>
            <p className="text-xl font-bold text-gray-800">
              {orders.length}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Future me yahan aapke saare orders dikhenge.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
            <p className="text-xs text-gray-500">Active Deals</p>
            <p className="text-xl font-bold text-gray-800">
              {recommended.length}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Recommended fasal jo abhi market me available hain.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
            <p className="text-xs text-gray-500">Account Type</p>
            <p className="text-xl font-bold text-gray-800 capitalize">
              {role || "-"}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Ye dashboard sirf buyers ke liye bana hai.
            </p>
          </div>
        </div>

        {/* Main sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left – Recommended deals */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                ⭐ Recommended Deals for You
              </h2>
              <button
                onClick={() => navigate("/marketplace")}
                className="text-xs text-green-700 hover:underline"
              >
                View all on marketplace
              </button>
            </div>

            {loading && (
              <p className="text-sm text-gray-600 mb-2">Loading deals...</p>
            )}
            {error && (
              <p className="text-sm text-red-600 mb-2">{error}</p>
            )}

            {recommended.length === 0 && !loading && !error && (
              <p className="text-sm text-gray-500">
                Abhi koi recommended deals nahi dikh rahe. Marketplace me jaa kar
                fasal dekhein.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {recommended.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onContact={handleContactFromDashboard}
                />
              ))}
            </div>
          </div>

          {/* Right – Saved crops & orders (placeholders for now) */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                🔖 Saved Crops
              </h3>
              {savedCrops.length === 0 ? (
                <p className="text-xs text-gray-500">
                  Abhi aapne koi fasal save nahi kiya hai.
                  <br />
                  Marketplace par jaa kar pasand ke crops ko save karne ki
                  suvidha hum jaldi laa rahe hain.
                </p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {savedCrops.map((item) => (
                    <li
                      key={item._id}
                      className="flex items-center justify-between"
                    >
                      <span>{item.name}</span>
                      <span className="text-xs text-gray-500">
                        ₹{item.pricePerUnit}/{item.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                📦 Recent Orders
              </h3>
              {orders.length === 0 ? (
                <p className="text-xs text-gray-500">
                  Abhi tak koi order nahi diya hai.
                  <br />
                  Marketplace se fasal chun kar directly farmers se deal
                  kar sakte hain.
                </p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {orders.map((order) => (
                    <li key={order._id}>
                      {order.productName} – {order.status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
