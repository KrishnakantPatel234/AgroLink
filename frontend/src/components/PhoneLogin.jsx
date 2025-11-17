import React, { useState } from "react";

const PhoneLogin = ({ onOTPSent }) => {
  const [phone, setPhone] = useState("");

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      alert("❗ Please enter a valid phone number.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();
    if (data.success) onOTPSent(phone);
    else alert("OTP sending failed ❌");
  };

  // 🎤 START SPEECH RECOGNITION
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;

    recognition.start();

    recognition.onresult = (event) => {
      let text = event.results[0][0].transcript;

      // Convert spoken words → digits
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

      setPhone(prev => prev + text);
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-4">

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          📱 Login with Phone
        </h2>

        <input
          type="text"
          className="w-full p-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition mb-4"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* BUTTONS ROW */}
        <div className="flex gap-3">
          <button
            onClick={startVoiceInput}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-xl rounded-xl shadow-md transition"
          >
            🎤
          </button>

          <button
            onClick={handleSendOTP}
            className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition"
          >
            Send OTP ➤
          </button>
        </div>

      </div>
    </div>
  );
};

export default PhoneLogin;
