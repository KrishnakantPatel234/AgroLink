import React, { useState } from "react";

const CreatePost = ({ userId, onPostCreated }) => {
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");


  // ⭐ Web Speech API voice input
  const startVoice = (setter) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Your browser does not support voice input.");

    const rec = new SR();
    rec.lang = "hi-IN"; // Hindi for farmers
    rec.start();

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setter(text);
    };
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload a crop image!");

    const formData = new FormData();
    formData.append("farmerId", userId);
    formData.append("cropName", cropName);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("title", title);

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
    <div className="min-h-screen bg-green-50 p-4 flex justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">

        <h2 className="text-3xl font-bold text-green-700 mb-5 text-center">
          Create New Crop Post
        </h2>

        {/* IMAGE PREVIEW */}
        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="w-full h-52 object-cover rounded-2xl mb-4 border"
            alt="preview"
          />
        )}

        {/* IMAGE INPUT */}
        <label className="block font-semibold mb-2">Upload Crop Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4"
        />

        <div className="mb-4">
        <label className="font-semibold">Title</label>
        <div className="flex gap-2 mt-1">
            <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-3 border rounded-xl shadow-sm"
            placeholder="Fresh Organic Tomatoes"
            />
            <button onClick={() => startVoice(setTitle)} className="px-4 bg-green-600 text-white rounded-xl">
            🎤
            </button>
        </div>
        </div>

        {/* INPUT FIELD TEMPLATE */}
        <div className="mb-4">
          <label className="font-semibold">Crop Name</label>
          <div className="flex gap-2 mt-1">
            <input
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="flex-1 p-3 border rounded-xl shadow-sm"
              placeholder="Tomato, Wheat, Rice..."
            />
            <button
              onClick={() => startVoice(setCropName)}
              className="px-4 bg-green-600 text-white rounded-xl"
            >
              🎤
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Quantity (KG)</label>
          <div className="flex gap-2 mt-1">
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-1 p-3 border rounded-xl shadow-sm"
              placeholder="100 KG"
            />
            <button
              onClick={() => startVoice(setQuantity)}
              className="px-4 bg-green-600 text-white rounded-xl"
            >
              🎤
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Price (₹ per KG)</label>
          <div className="flex gap-2 mt-1">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 p-3 border rounded-xl shadow-sm"
              placeholder="₹20"
            />
            <button
              onClick={() => startVoice(setPrice)}
              className="px-4 bg-green-600 text-white rounded-xl"
            >
              🎤
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Location</label>
          <div className="flex gap-2 mt-1">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 p-3 border rounded-xl shadow-sm"
              placeholder="Nagpur, Pune..."
            />
            <button
              onClick={() => startVoice(setLocation)}
              className="px-4 bg-green-600 text-white rounded-xl"
            >
              🎤
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Description</label>
          <div className="flex gap-2 mt-1">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 p-3 border rounded-xl shadow-sm h-24"
              placeholder="Fresh tomatoes, organic, good quality..."
            ></textarea>
            <button
              onClick={() => startVoice(setDescription)}
              className="px-4 bg-green-600 text-white rounded-xl h-12"
            >
              🎤
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 mt-4 bg-green-700 text-white font-bold rounded-xl shadow-lg hover:bg-green-800 transition"
        >
          ✔ Submit Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
