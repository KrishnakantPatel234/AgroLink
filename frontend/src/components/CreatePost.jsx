import React, { useState } from "react";

const CreatePost = ({ userId, onPostCreated }) => {
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const startVoice = (setter) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported!");

    const rec = new SR();
    rec.lang = "en-IN";
    rec.start();

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setter(text);
    };
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("farmerId", userId);
    formData.append("cropName", cropName);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("image", image);

    const res = await fetch("http://localhost:5000/api/post/create", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      alert("Post created successfully!");
      onPostCreated();
    } else {
      alert("Failed to create post.");
    }
  };

  return (
    <div className="min-h-screen bg-green-100 p-4 flex justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">➕ Create New Post</h2>

        {/* IMAGE */}
        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="w-full h-48 object-cover rounded-xl mb-3"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4"
        />

        {/* Crop Name */}
        <label className="font-semibold">Crop Name</label>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 p-2 border rounded-xl"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
          />
          <button className="px-3 bg-green-600 text-white rounded-xl" onClick={() => startVoice(setCropName)}>🎤</button>
        </div>

        {/* Quantity */}
        <label className="font-semibold">Quantity (KG)</label>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 p-2 border rounded-xl"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button className="px-3 bg-green-600 text-white rounded-xl" onClick={() => startVoice(setQuantity)}>🎤</button>
        </div>

        {/* Price */}
        <label className="font-semibold">Price (₹ per KG)</label>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 p-2 border rounded-xl"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button className="px-3 bg-green-600 text-white rounded-xl" onClick={() => startVoice(setPrice)}>🎤</button>
        </div>

        {/* Location */}
        <label className="font-semibold">Location</label>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 p-2 border rounded-xl"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="px-3 bg-green-600 text-white rounded-xl" onClick={() => startVoice(setLocation)}>🎤</button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-xl shadow-md hover:bg-green-700 transition"
        >
          ✔ Submit Post
        </button>

      </div>
    </div>
  );
};

export default CreatePost;
