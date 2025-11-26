import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../api";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🎤 Mic function
  const startVoiceInput = (setter, numberOnly = false) => {
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return alert("Mic not supported on this browser!");

      const rec = new SR();
      rec.lang = "en-IN";
      rec.start();

      rec.onresult = (event) => {
        let text = event.results[0][0].transcript.toLowerCase();

        // Convert to numeric if required
        text = text
          .replace(/zero/gi, "0")
          .replace(/one/gi, "1")
          .replace(/two/gi, "2")
          .replace(/three/gi, "3")
          .replace(/four/gi, "4")
          .replace(/five/gi, "5")
          .replace(/six/gi, "6")
          .replace(/seven/gi, "7")
          .replace(/eight/gi, "8")
          .replace(/nine/gi, "9");

        if (numberOnly) text = text.replace(/\D/g, "");
        setter(text);
      };
    } catch (err) {
      console.error("🎤 MIC ERROR:", err);
      alert("Microphone not supported!");
    }
  };

  // 🟢 Handle Login
  const handleLogin = async () => {
  if (!phone || !password) {
    alert("Please enter both phone number and password.");
    return;
  }

  try {
    const data = await postRequest("/auth/login", { phone, password });

    if (!data.success) {
      alert(data.error || "Invalid credentials");
      return;
    }

    // Prefer consistent user object
    const user = data.user || {
      _id: data._id,
      name: data.name,
      role: data.role,
    };

    // Save to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", user._id);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("role", user.role);

    if (user.profileImage || data.user?.profileImage) {
      const imgPath = user.profileImage || data.user.profileImage;
      localStorage.setItem("userImage", `http://localhost:5000/${imgPath}`);
    }

    //✅ Role-based navigation (use user.role directly)
    if (user.role === "farmer") {
      navigate("/farmer-dashboard");
    } else if (user.role === "buyer") {
      navigate("/buyer-dashboard");
    } else {
      navigate("/");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong while logging in.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Welcome to <span className="text-green-500">BharatKrishi</span>
        </h2>

        {/* Phone Field */}
        <label className="block text-gray-600 mb-1 font-semibold">
          Phone Number
        </label>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            className="w-full p-3 border rounded-xl focus:outline-green-600"
            placeholder="Enter phone number"
            maxLength="10"
          />
          <button
            className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
            onClick={() => startVoiceInput(setPhone, true)}
          >
            🎤
          </button>
        </div>

        {/* Password Field */}
        <label className="block text-gray-600 mb-1 font-semibold">
          Password
        </label>
        <div className="flex items-center gap-2 mb-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-green-600"
            placeholder="Enter password"
          />
          <button
            className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
            onClick={() => startVoiceInput(setPassword)}
          >
            🎤
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          New User?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-green-700 font-semibold cursor-pointer"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
