import React, { useEffect, useState } from "react";

const FarmerDashboard = ({ userId, setStep }) => {
  const [farmer, setFarmer] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch farmer data + posts
  useEffect(() => {
    fetch(`http://localhost:5000/api/farmer/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        setFarmer(data.farmer);
        setPosts(data.posts);
      })
      .catch(err => console.log(err));
  }, [userId]);

  if (!farmer) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-green-100 p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-700">👨‍🌾 Farmer Dashboard</h1>

        <img 
        src={`http://localhost:5000/${farmer.profileImage}`} 
        className="w-16 h-16 rounded-full object-cover"
        />
      </div>

      {/* Farmer Card */}
      <div className="bg-white shadow-md rounded-2xl p-4 mb-5">
        <h2 className="text-xl font-semibold">{farmer.name}</h2>
        
        <p className="text-gray-700">📞 {farmer.phone}</p>
        <p className="text-gray-700">🌾 Land: {farmer.landSize}</p>

        {farmer.isOrganic && (
          <span className="mt-2 inline-block bg-green-600 text-white px-3 py-1 rounded-xl text-sm">
            ✔ Organic Farmer
          </span>
        )}
      </div>

      {/* Create Post Button */}
      <button
        onClick={() => setStep("create-post")}
        className="w-full bg-green-600 text-white py-3 rounded-xl shadow-md text-lg font-semibold hover:bg-green-700 transition mb-4"
      >
        ➕ Create New Post
      </button>

      {/* Posts List */}
      <h2 className="text-xl font-bold mb-3">Your Posts</h2>

      {posts.length === 0 ? (
        <p className="text-gray-600">You haven't posted anything yet.</p>
      ) : (
        posts.map(post => (
          <div
            key={post._id}
            className="bg-white shadow-lg rounded-xl p-4 mb-3"
          >
            <div className="flex gap-3">
              <img
                src={`http://localhost:5000/${post.image}`}
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div>
                <h3 className="text-lg font-semibold">{post.cropName}</h3>
                <p className="text-gray-700">📦 {post.quantity} KG</p>
                <p className="text-gray-700">💰 ₹{post.price} per KG</p>
                <p className="text-gray-500 text-sm">📅 {post.date}</p>
              </div>
            </div>
          </div>
        ))
      )}

    </div>
  );
};

export default FarmerDashboard;
