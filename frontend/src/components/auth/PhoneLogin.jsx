import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../../api";

const Register = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      alert("📢 Please enter a valid 10-digit phone number.");
      return;
    }
    if (!password || password.length < 4) {
      alert("📢 Password must be at least 4 characters.");
      return;
    }

    const data = await postRequest("/auth/send-otp" , {phone})

    if (data.success) {
      navigate(`/otp/${phone}`, {
        state: { phone, password }
      });
    } else {
      alert("❌ Failed to send OTP. Try again.");
    }
  };

  // 🎤 Voice input for Phone Number
  const startPhoneVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Mic not supported!");

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

  // 🎤 Voice input for PASSWORD
  const startPasswordVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Mic not supported!");

    const rec = new SR();
    rec.lang = "en-IN"; // better accuracy for spelling
    rec.start();

    rec.onresult = (e) => {
      let spoken = e.results[0][0].transcript.toLowerCase();

      // Convert “a b c one two” → “abc12”
      let converted = spoken
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
        .replace(/\s+/g, "") // remove spaces (abc 1 2 -> abc12)
        .replace(/[^a-z0-9]/gi, ""); // keep only valid chars

      setPassword(prev => prev + converted);
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Create Your Account
        </h2>

        <p className="text-center text-gray-600 mb-4">
          Enter your phone & password to begin.
        </p>

        {/* PHONE INPUT */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            maxLength="10"
            className="w-full p-3 text-lg border rounded-xl focus:ring-2 focus:ring-green-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="Phone Number"
          />
          <button
            onClick={startPhoneVoice}
            className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            🎤
          </button>
        </div>

        {/* PASSWORD INPUT */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="password"
            className="w-full p-3 text-lg border rounded-xl focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create Password"
          />
          <button
            onClick={startPasswordVoice}
            className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            🎤
          </button>
        </div>

        {/* SEND OTP */}
        <button
          onClick={handleSendOTP}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition"
        >
          Send OTP
        </button>

        {/* LOGIN OPTION */}
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
