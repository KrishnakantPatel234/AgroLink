import React, { useState } from "react";

const RoleSelect = ({ userId, onRoleSelected }) => {
  const [role, setRole] = useState("");

  const selectRole = async (selectedRole) => {
    setRole(selectedRole);

    // Move to profile setup
    onRoleSelected(selectedRole);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;

    recognition.start();

    recognition.onresult = (event) => {
      let text = event.results[0][0].transcript.toLowerCase();

      console.log("🎤 Heard:", text);

      if (text.includes("farmer") || text.includes("फार्मर") || text.includes("kisan")) {
        selectRole("farmer");
      }

      if (text.includes("buyer") || text.includes("बायर") || text.includes("खरीदार")) {
        selectRole("buyer");
      }
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">

        <h2 className="text-2xl font-bold text-green-700 mb-6">
          👤 Select Your Role
        </h2>

        {/* Farmer Button */}
        <button
          onClick={() => selectRole("farmer")}
          className={`w-full p-4 mb-4 rounded-xl border-2 
            ${role === "farmer" ? "border-green-600 bg-green-200" : "border-gray-300"}
            text-xl font-semibold transition`}
        >
          👨‍🌾 Farmer
        </button>

        {/* Buyer Button */}
        <button
          onClick={() => selectRole("buyer")}
          className={`w-full p-4 rounded-xl border-2 
            ${role === "buyer" ? "border-green-600 bg-green-200" : "border-gray-300"}
            text-xl font-semibold transition`}
        >
          🛒 Buyer
        </button>

        {/* Mic Button */}
        <button
          onClick={startVoiceInput}
          className="mt-6 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xl shadow-md"
        >
          🎤 Speak Role
        </button>
      </div>
    </div>
  );
};

export default RoleSelect;
