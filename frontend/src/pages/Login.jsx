import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // 🎤 UNIVERSAL MIC FUNCTION
  const startVoiceInput = (setter, numberOnly = false) => {
    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "hi-IN";

      recognition.onresult = (event) => {
        let text = event.results[0][0].transcript;

        console.log("🎤 Recognized:", text);

        // If phone field → extract numbers only
        if (numberOnly) {
          text = text.replace(/\D/g, ""); // remove non-digits
        }

        setter(text);
      };

      recognition.start();
    } catch (err) {
      alert("Microphone not supported in this device!");
      console.log("MIC ERROR:", err);
    }
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);
      navigate("/dashboard");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Welcome to <span className="text-green-500">BharatKrishi</span>
        </h2>

        {/* PHONE FIELD */}
        <label className="block text-gray-600 mb-1 font-semibold">Phone Number</label>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-green-600"
            placeholder="Enter phone number"
          />

          {/* 🎤 Mic for phone */}
          <button
            className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
            onClick={() => startVoiceInput(setPhone, true)}
          >
            🎤
          </button>
        </div>

        {/* PASSWORD FIELD */}
        <label className="block text-gray-600 mb-1 font-semibold">Password</label>

        <div className="flex items-center gap-2 mb-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-green-600"
            placeholder="Enter password"
          />

          {/* 🎤 Mic for password */}
          <button
            className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
            onClick={() => startVoiceInput(setPassword, false)}
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
            onClick={() => navigate("/otp")}
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
