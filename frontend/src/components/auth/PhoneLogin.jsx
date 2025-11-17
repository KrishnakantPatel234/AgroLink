import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      alert("📢 Please enter a valid 10-digit phone number.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();

    if (data.success) {
      navigate("/otp", { state: { phone } });
    } else {
      alert("❌ Failed to send OTP. Try again.");
    }
  };

  // 🎤 Voice input
  const startVoiceInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Mic not supported!");
      return;
    }

    const rec = new SR();
    rec.lang = "hi-IN";
    rec.start();

    rec.onresult = (e) => {
      let text = e.results[0][0].transcript;

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
        .replace(/nine/gi, "9")
        .replace(/\D/g, "");

      setPhone(text);
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-4">

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Create Your Account
        </h2>

        <p className="text-center text-gray-600 mb-4">
          Enter your phone number to begin registration.
        </p>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            maxLength="10"
            className="w-full p-3 text-lg border rounded-xl focus:ring-2 focus:ring-green-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="Phone Number"
          />

          {/* 🎤 Mic */}
          <button
            onClick={startVoiceInput}
            className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            🎤
          </button>
        </div>

        <button
          onClick={handleSendOTP}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition"
        >
          Send OTP
        </button>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            className="text-green-700 cursor-pointer font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;
