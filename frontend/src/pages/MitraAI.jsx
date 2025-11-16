import React, { useState } from "react";
import VoiceRecorder from "../components/VoiceRecorder";

const API_URL = "http://localhost:5000/api/mitra";

const MitraAI = () => {
  const [textInput, setTextInput] = useState("");
  const [chat, setChat] = useState([]);
  const [messages, setMessages] = useState([]);
  const userId = "123"; // Replace with user from auth

  const sendText = async () => {
    const res = await fetch(`${API_URL}/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        message: textInput,
        language: "hi" // auto detect later
      })
    });

    const data = await res.json();

    setChat((prev) => [
      ...prev,
      { from: "user", text: textInput },
      { from: "mitra", text: data.reply }
    ]);

    setTextInput("");
  };

  const handleTranscription = async (text) => {
    console.log("🔥 Final text from voice:", text);

    // Ab text backend ko bhej do
    const res = await fetch("http://localhost:5000/api/mitra/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "123",
        language: "hi",
        message: text,
      }),
    });

    const data = await res.json();

    // Chatbot reply add
    setMessages((prev) => [
      ...prev,
      { user: "You", msg: text },
      { user: "Mitra", msg: data.reply },
    ]);
  };

  return (
    <div style={{ width: "60%", margin: "auto", paddingTop: "30px" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>🌱 Mitra - AI Farming Assistant</h1>

      {/* CHAT BOX */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "20px",
        }}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.from === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 15px",
                borderRadius: "10px",
                background: msg.from === "user" ? "#d1f8d6" : "#fff",
                boxShadow: "0px 0px 4px rgba(0,0,0,0.1)",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* TEXT INPUT */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Type here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid gray",
          }}
        />

        <button
          onClick={sendText}
          style={{
            padding: "12px 20px",
            background: "#007bff",
            color: "white",
            borderRadius: "10px",
            border: "none",
          }}
        >
          Send
        </button>
      </div>

      {/* VOICE RECORDER */}
      <VoiceRecorder  onTranscription={handleTranscription} />
    </div>
  );
};

export default MitraAI;