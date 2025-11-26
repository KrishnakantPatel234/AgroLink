import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api"; 
import { useNavigate } from "react-router-dom";

const FarmerDashboard = () => {
  const [farmer, setFarmer] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Fetch farmer data + posts
  useEffect(() => {

    if (role !== "farmer") {
      if (role === "buyer") {
        navigate("/buyer-dashboard");
      } else {
        navigate("/login");
      }
      return;
    }

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    const fetchFarmerData = async () => {
      try {
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
          // backend se aa raha hai: { success, user, ... }
          setFarmer(data.user);
          setPosts(data.posts || []); // agar tum posts add kar rahe ho to
        } else {
          alert("Failed to fetch farmer data");
        }
      } catch (err) {
        console.error("Error fetching farmer data:", err);
      }
    };

    if (userId && token) {
      fetchFarmerData();
    }
  }, [userId, token, role, navigate]);


  if (!farmer)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading Farmer Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-green-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-700">👨‍🌾 Farmer Dashboard</h1>

        {farmer.profileImage ? (
          <img
            src={`${API_BASE_URL.replace("/api", "")}/${farmer.profileImage}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
            alt="Farmer"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
            No Photo
          </div>
        )}
      </div>

      {/* Farmer Card */}
      <div className="bg-white shadow-md rounded-2xl p-4 mb-5">
        <h2 className="text-xl font-semibold">{farmer.name}</h2>
        <p className="text-gray-700">📞 {farmer.phone}</p>
        <p className="text-gray-700">🌾 Land: {farmer.landSize || "N/A"}</p>

        {farmer.isOrganic && (
          <span className="mt-2 inline-block bg-green-600 text-white px-3 py-1 rounded-xl text-sm">
            ✔ Organic Farmer
          </span>
        )}
      </div>

      {/* Create Post Button */}
      <button
        onClick={() => (window.location.href = "/create-post")}
        className="w-full bg-green-600 text-white py-3 rounded-xl shadow-md text-lg font-semibold hover:bg-green-700 transition mb-4"
      >
        ➕ Create New Post
      </button>

      {/* Posts List */}
      <h2 className="text-xl font-bold mb-3">Your Posts</h2>

      {posts.length === 0 ? (
        <p className="text-gray-600">You haven't posted anything yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white shadow-lg rounded-xl p-4 mb-3">
            <div className="flex gap-3">
              {post.image ? (
                <img
                  src={`${API_BASE_URL.replace("/api", "")}/${post.image}`}
                  className="w-20 h-20 rounded-lg object-cover"
                  alt="Crop"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
                  No Image
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold">{post.cropName}</h3>
                <p className="text-gray-700">📦 {post.quantity} KG</p>
                <p className="text-gray-700">💰 ₹{post.price} per KG</p>
                <p className="text-gray-500 text-sm">
                  📅 {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FarmerDashboard;
