import React, { useState } from "react";

const ProfileSetup = ({ userId, role, onProfileDone }) => {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);

  // Farmer fields
  const [landSize, setLandSize] = useState("");
  const [isOrganic, setIsOrganic] = useState(false);

  // Buyer fields
  const [businessType, setBusinessType] = useState("");
  const [isBulkBuyer, setIsBulkBuyer] = useState(false);

  const handleVoiceInput = (setter) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported!");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (e) => {
      const spoken = e.results[0][0].transcript;

      // Convert common words
      let final = spoken.replace(/yes|haan|ha/gi, "yes")
                        .replace(/no|na|nahi/gi, "no");

      setter(final);
    };
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("userId", userId);
    formData.append("role", role);
    formData.append("name", name);
    if (photo) formData.append("profileImage", photo);

    if (role === "farmer") {
      formData.append("landSize", landSize);
      formData.append("isOrganic", isOrganic);
    }

    if (role === "buyer") {
      formData.append("businessType", businessType);
      formData.append("isBulkBuyer", isBulkBuyer);
    }

    const res = await fetch("http://localhost:5000/api/auth/update-profile", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      onProfileDone();
    } else {
      alert("Profile update failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200 p-4">
      
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">

        <h2 className="text-xl text-center font-bold text-green-700 mb-4">
          📝 Complete Your Profile
        </h2>

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-4">
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              alt="preview"
              className="w-24 h-24 rounded-full mb-3 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-3 flex items-center justify-center text-gray-500">
              No Photo
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        {/* Name */}
        <label className="font-semibold">Name</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 p-2 border rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={() => handleVoiceInput(setName)}
            className="px-3 bg-green-500 text-white rounded-xl"
          >
            🎤
          </button>
        </div>

        {/* Farmer UI */}
        {role === "farmer" && (
          <>
            <label className="font-semibold">Land Size (e.g., 4 acres)</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 p-2 border rounded-xl"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
              />
              <button
                onClick={() => handleVoiceInput(setLandSize)}
                className="px-3 bg-green-500 text-white rounded-xl"
              >
                🎤
              </button>
            </div>

            {/* Organic Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Organic Farmer?</span>
              <button
                onClick={() => setIsOrganic(!isOrganic)}
                className={`px-4 py-2 rounded-xl text-white ${
                  isOrganic ? "bg-green-600" : "bg-gray-400"
                }`}
              >
                {isOrganic ? "YES" : "NO"}
              </button>
            </div>
          </>
        )}

        {/* Buyer UI */}
        {role === "buyer" && (
          <>
            <label className="font-semibold">Business Type</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 p-2 border rounded-xl"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              />
              <button
                onClick={() => handleVoiceInput(setBusinessType)}
                className="px-3 bg-green-500 text-white rounded-xl"
              >
                🎤
              </button>
            </div>

            {/* Bulk Buyer */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Bulk Buyer?</span>
              <button
                onClick={() => setIsBulkBuyer(!isBulkBuyer)}
                className={`px-4 py-2 rounded-xl text-white ${
                  isBulkBuyer ? "bg-green-600" : "bg-gray-400"
                }`}
              >
                {isBulkBuyer ? "YES" : "NO"}
              </button>
            </div>
          </>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="w-full mt-3 p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl"
        >
          ✔ Save Profile
        </button>

      </div>
    </div>
  );
};

export default ProfileSetup;
