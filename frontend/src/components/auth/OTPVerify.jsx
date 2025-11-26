import React, { useState, useRef } from "react";
import { postRequest } from "../../api";  // import sahi path se



const OTPVerify = ({ phone, onVerified }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const verifyOTP = async () => {
    const finalOTP = otp.join("");

    if (finalOTP.length < 4) {
      alert("Please enter complete OTP");
      return;
    }

    const data = await postRequest("/auth/verify-otp", { phone , otp : finalOTP });

    if (data.success) {
      onVerified(data.userId);
    } else {
      alert("❌ Invalid OTP");
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;

    recognition.start();

    recognition.onresult = (event) => {
      let text = event.results[0][0].transcript;

      // convert spoken numbers → digits
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
        .replace(/\D/g, ""); // remove non-digit characters

      if (text.length >= 4) text = text.slice(0, 4);

      const newArr = text.split("");

      const filled = ["", "", "", ""];
      for (let i = 0; i < newArr.length; i++) filled[i] = newArr[i];

      setOtp(filled);

      // focus last box
      inputRefs[filled.length - 1].current.focus();
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold text-green-700 text-center mb-3">
          🔐 Enter OTP
        </h2>

        <p className="text-center text-gray-600 mb-6">
          OTP sent to: <span className="font-semibold">{phone}</span>
        </p>

        {/* OTP BOXES */}
        <div className="flex justify-between mb-6">
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              maxLength="1"
              className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              value={otp[i]}
              onChange={(e) => handleChange(e.target.value, i)}
            />
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={startVoiceInput}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-xl rounded-xl shadow-md transition"
          >
            🎤
          </button>

          <button
            onClick={verifyOTP}
            className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition"
          >
            Verify OTP ✔
          </button>
        </div>

      </div>
    </div>
  );
};

export default OTPVerify;
