import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [role, setRole] = useState("farmer");
  const [landSize, setLandSize] = useState("");
  const [isOrganic, setIsOrganic] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const [isBulkBuyer, setIsBulkBuyer] = useState(false);

  // 🎤 Voice input function
  const startVoice = (setter, numberOnly = false) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Mic not supported!");
    const rec = new SR();
    rec.lang = "hi-IN";
    rec.start();
    rec.onresult = (e) => {
      let text = e.results[0][0].transcript;
      if (numberOnly) text = text.replace(/\D/g, "");
      setter(text);
    };
  };

  const startPasswordVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Mic not supported!");
    const rec = new SR();
    rec.lang = "en-IN";
    rec.start();

    rec.onresult = (e) => {
      let text = e.results[0][0].transcript
        .toLowerCase()
        .replace(/zero/gi, "0")
        .replace(/one/gi, "1")
        .replace(/two/gi, "2")
        .replace(/three/gi, "3")
        .replace(/four/gi, "4")
        .replace(/five/gi, "5")
        .replace(/six/gi, "6")
        .replace(/seven/gi, "7")
        .replace(/eight/gi, "8")
        .replace(/nine/gi, "9")
        .replace(/\s+/g, "");
      setPassword(text);
    };
  };

  // 🔁 Role change reset
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    if (newRole === "farmer") {
      setBusinessType("");
      setIsBulkBuyer(false);
    } else {
      setLandSize("");
      setIsOrganic(false);
    }
  };

  // 📤 Submit Registration
  const handleRegister = async () => {
  if (!phone || !password || !name || !role) {
    alert("Please fill all required fields and select role");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("role", role);
    if (photo) formData.append("profileImage", photo);

    if (role === "farmer") {
      formData.append("landSize", landSize);
      formData.append("isOrganic", isOrganic);
    }

    if (role === "buyer") {
      formData.append("businessType", businessType);
      formData.append("isBulkBuyer", isBulkBuyer);
    }

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert("Registration failed: " + (data.error || "Unknown error"));
      return;
    }

    const user = data.user || {
      _id: data._id,
      name: data.name,
      role: data.role,
      profileImage: data.profileImage,
    };

    // 🔐 save auth info
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", user._id);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("role", user.role);

    if (user.profileImage) {
      localStorage.setItem(
        "userImage",
        `http://localhost:5000/${user.profileImage}`
      );
    }

    // ✅ Role-based redirect – yahi se buyer/farmer split
    if (user.role === "farmer") {
      navigate("/farmer-dashboard");
    } else if (user.role === "buyer") {
      navigate("/buyer-dashboard");
    } else {
      navigate("/");
    }
  } catch (err) {
    console.error("Register error:", err);
    alert("Something went wrong during registration.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-4">
          🌾 BharatKrishi Registration
        </h2>

        {/* PROFILE IMAGE */}
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

        {/* NAME FIELD */}
        <label className="font-semibold">Name</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-xl"
            placeholder="Enter your full name"
          />
          <button
            onClick={() => startVoice(setName)}
            className="p-2 bg-green-600 text-white rounded-xl"
          >
            🎤
          </button>
        </div>

        {/* PHONE FIELD */}
        <label className="font-semibold">Phone</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            maxLength="10"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            className="w-full p-2 border rounded-xl"
            placeholder="Phone number"
          />
          <button
            onClick={() => startVoice(setPhone, true)}
            className="p-2 bg-green-600 text-white rounded-xl"
          >
            🎤
          </button>
        </div>

        {/* PASSWORD FIELD */}
        <label className="font-semibold">Password</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-xl"
            placeholder="Create password"
          />
          <button
            onClick={startPasswordVoice}
            className="p-2 bg-green-600 text-white rounded-xl"
          >
            🎤
          </button>
        </div>

        {/* ROLE SELECTION */}
        <label className="font-semibold">Role</label>
        <select
          value={role}
          onChange={handleRoleChange}
          className="w-full mb-4 p-2 border rounded-xl"
        >
          <option value="farmer">Farmer</option>
          <option value="buyer">Buyer</option>
        </select>

        {/* FARMER FIELDS */}
        {role === "farmer" && (
          <>
            <label className="font-semibold">Land Size</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                className="w-full p-2 border rounded-xl"
                placeholder="e.g., 5 acres"
              />
              <button
                onClick={() => startVoice(setLandSize)}
                className="p-2 bg-green-600 text-white rounded-xl"
              >
                🎤
              </button>
            </div>

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

        {/* BUYER FIELDS */}
        {role === "buyer" && (
          <>
            <label className="font-semibold">Business Type</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full p-2 border rounded-xl"
                placeholder="e.g., Wholesale"
              />
              <button
                onClick={() => startVoice(setBusinessType)}
                className="p-2 bg-green-600 text-white rounded-xl"
              >
                🎤
              </button>
            </div>

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

        <button
          onClick={handleRegister}
          className="w-full mt-3 p-3 bg-green-600 text-white rounded-xl font-semibold"
        >
          ✅ Register
        </button>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-700 cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
