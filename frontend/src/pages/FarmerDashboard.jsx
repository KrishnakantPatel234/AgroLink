import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";
import CropPostCard from "../components/CropPostCard";

const FarmerDashboard = () => {
  const [farmer, setFarmer] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const IMAGE_BASE_URL = API_BASE_URL.replace("/api", "");

  useEffect(() => {
    if (role !== "farmer") {
      if (role === "buyer") navigate("/buyer-dashboard");
      else navigate("/login");
      return;
    }

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    const fetchFarmerData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/farmer/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Farmer profile error:", data.error);
          alert(data.error || "Failed to fetch farmer data");
          return;
        }

        if (data.success) {
          setFarmer(data.user);

          const fetchedPosts = data.posts || [];
          const sorted = [...fetchedPosts].sort((a, b) => {
            const da = new Date(a.createdAt || a.date || 0);
            const db = new Date(b.createdAt || b.date || 0);
            return db - da; // latest first
          });
          setPosts(sorted);
        } else {
          alert("Failed to fetch farmer data");
        }
      } catch (err) {
        console.error("Error fetching farmer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, [userId, token, role, navigate , API_BASE_URL]);

  const totalPosts = posts.length;
  const totalQuantity = posts.reduce(
    (sum, p) => sum + (Number(p.quantity) || 0),
    0
  );

  if (loading || !farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white px-6 py-4 rounded-xl shadow-md border border-green-100 text-gray-700">
          Loading Farmer Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-green-800 flex items-center gap-2">
              👨‍🌾 Farmer Dashboard
              {farmer.isOrganic && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                  Organic Farmer
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, <span className="font-semibold">{farmer.name}</span> – manage
              your crop posts and connect with buyers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {farmer.profileImage ? (
              <img
                src={`${IMAGE_BASE_URL}/${farmer.profileImage}`}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-green-500 shadow-sm"
                alt="Farmer"
              />
            ) : (
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-xl">
                {farmer.name?.charAt(0).toUpperCase() || "F"}
              </div>
            )}
            <div className="text-sm">
              <p className="font-semibold text-gray-800">{farmer.name}</p>
              <p className="text-gray-500 text-xs">📞 {farmer.phone}</p>
              {farmer.landSize && (
                <p className="text-gray-500 text-xs">
                  🌾 Land: {farmer.landSize}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats + CTA */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/90 border border-green-100 rounded-2xl shadow-sm p-4">
            <p className="text-xs text-gray-500">Total Posts</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{totalPosts}</p>
          </div>
          <div className="bg-white/90 border border-green-100 rounded-2xl shadow-sm p-4">
            <p className="text-xs text-gray-500">Total Quantity Listed (KG)</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {totalQuantity}
            </p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl shadow-sm p-4">
            <p className="text-xs text-gray-500">Tip</p>
            <p className="text-sm text-gray-700 mt-1">
              Clear images & correct price help you get buyers faster.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-2xl shadow-md p-4 text-white flex flex-col justify-between">
            <p className="text-sm font-semibold">Create New Crop Post</p>
            <p className="text-[11px] text-green-100 mt-1">
              Add your latest harvest, it will appear on Marketplace too.
            </p>
            <button
              onClick={() => navigate("/create-post")}
              className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold border border-white/30 transition"
            >
              ➕ Create Post
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="bg-white/95 border border-green-100 rounded-2xl shadow-sm p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              Your Crop Posts
            </h2>
            <span className="text-xs text-gray-500">
              Latest posts appear first
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              You haven&apos;t posted anything yet.
              <br />
              <button
                onClick={() => navigate("/create-post")}
                className="mt-3 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm rounded-xl shadow hover:bg-green-700 transition"
              >
                ➕ Create your first post
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <CropPostCard
                  key={post._id}
                  post={post}
                  // future: navigate to detail page
                  onClick={() => {
                    // e.g. navigate(`/post/${post._id}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
