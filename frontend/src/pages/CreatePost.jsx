import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

const CreatePost = ({ userId, onPostCreated }) => {
  const [cropName, setCropName] = useState("");
  const [unit, setUnit] = useState("kg");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ⭐ Web Speech API voice input
  const startVoice = (setter) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Your browser does not support voice input.");

    const rec = new SR();
    rec.lang = "hi-IN";
    rec.start();

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setter(text);
    };
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload a crop image!");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Please login as a farmer first.");
      navigate("/login");
      return;
    }

    if (role !== "farmer") {
      alert("Only farmers can create crop posts.");
      return;
    }

    const formData = new FormData();
    formData.append("farmerId", userId);
    formData.append("cropName", cropName);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("title", title);
    formData.append("unit", unit); 

    try {
      const res = await fetch(`${API_BASE_URL}/post/create`, {
        method: "POST",
        headers: {
          // ❗ Content-Type mat set karo, FormData karega
          Authorization: `Bearer ${token}`, // 🟢 yahi missing tha
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Post created successfully!");

        // agar FarmerDashboard se onPostCreated pass ho raha hai
        if (onPostCreated) {
          onPostCreated(data.post);
        } else {
          // safety: direct dashboard pe bhej do
          navigate("/farmer-dashboard");
        }
      } else {
        alert(data.error || "Failed to create post.");
      }
    } catch (err) {
      console.error("Create post error:", err);
      alert("Something went wrong while creating post.");
    }
  };

  const VoiceButton = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="px-3 md:px-4 bg-green-600 text-white rounded-xl text-sm md:text-base flex items-center justify-center shadow-sm hover:bg-green-700 active:scale-95 transition"
    >
      🎤
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-green-100 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-700">
              Create New Crop Post
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Apni fasal ki jankari simple shabdon me likhiye – ya 🎤 se bolkar
            </p>
          </div>
          <span className="text-[11px] md:text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
            👨‍🌾 Farmer Post · BharatKrishi
          </span>
        </div>

        {/* IMAGE PREVIEW */}
        {image && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(image)}
              className="w-full h-56 md:h-64 object-cover rounded-2xl border border-green-100 shadow-sm"
              alt="preview"
            />
          </div>
        )}

        {/* IMAGE INPUT */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-800 mb-1">
            Crop Image <span className="text-red-500">*</span>
          </label>
          <p className="text-[11px] md:text-xs text-gray-500 mb-1">
            Field ki photo ya crop ki close-up photo lagaye (clear & bright).
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-sm"
          />
        </div>

        {/* FORM GRID */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="font-semibold text-gray-800">
                Title / Heading
              </label>
              <p className="text-[11px] text-gray-500 mb-1">
                Short title jaise: "Fresh Organic Tomatoes – Ready to Sell"
              </p>
              <div className="flex gap-2 mt-1">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 p-3 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Fresh Organic Tomatoes"
                />
                <VoiceButton onClick={() => startVoice(setTitle)} />
              </div>
            </div>

            {/* Crop Name */}
            <div>
              <label className="font-semibold text-gray-800">
                Crop Name <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="flex-1 p-3 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Tomato, Wheat, Rice..."
                />
                <VoiceButton onClick={() => startVoice(setCropName)} />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="font-semibold text-gray-800">
                Location <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-gray-500 mb-1">
                Shehar / gaon + district (Example: "Dhar, Indore")
              </p>
              <div className="flex gap-2 mt-1">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 p-3 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Nagpur, Pune..."
                />
                <VoiceButton onClick={() => startVoice(setLocation)} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">
            
            {/* Quantity + Unit */}
              <div>
                <label className="font-semibold text-gray-800">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-gray-500 mb-1">
                  Quantity + unit select karein (KG / Quintal / Dozen...)
                </p>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex-1 p-3 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="100"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-2 md:px-3 py-2 border rounded-xl text-xs md:text-sm shadow-sm focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  >
                    {/* ⚠️ In options ko Product schema enum ke EXACT hisaab se rakho */}
                    <option value="kg">KG</option>
                    <option value="quintal">Quintal</option>
                    <option value="dozen">Dozen</option>
                    <option value="ton">Ton</option>
                  </select>
                  <VoiceButton onClick={() => startVoice(setQuantity)} />
                </div>
              </div>
            {/* Price */}
            <div>
              <label className="font-semibold text-gray-800">
                Price (₹ per {unit.toLowerCase()}) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex-1 p-3 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="20"
                />
                <VoiceButton onClick={() => startVoice(setPrice)} />
              </div>
            </div>


            {/* Description */}
            <div>
              <label className="font-semibold text-gray-800">
                Description
              </label>
              <p className="text-[11px] text-gray-500 mb-1">
                Quality, irrigation, organic / non-organic, delivery, etc.
              </p>
              <div className="flex gap-2 mt-1">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 p-3 border rounded-xl shadow-sm text-sm h-24 resize-none focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Fresh tomatoes, organic, good quality..."
                />
                <VoiceButton onClick={() => startVoice(setDescription)} />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 mt-6 font-bold rounded-xl shadow-lg text-white transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
        >
          {loading ? "Posting..." : "✔ Submit Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
