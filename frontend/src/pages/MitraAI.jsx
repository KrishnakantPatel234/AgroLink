import React, { useState, useRef, useEffect } from "react";
import VoiceRecorder from "../components/VoiceRecorder";
import ChatBubble from "../components/ChatBubble";
import "../styles/mitra.css";

const MitraChat = () => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const fileRef = useRef(null);
  const scrollRef = useRef(null);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { user: "You", msg: text }]);

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

    setMessages(prev => [...prev, { user: "Mitra", msg: data.reply }]);
    setInputText("");
  };

  const handleVoice = (text) => {
    sendMessage(text);
    setRecording(false);
  };

  const handleImage = async (file) => {
    const form = new FormData();
    form.append("image", file);

    const res = await fetch("http://localhost:5000/api/mitra/detect", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      { user: "You", msg: "🖼️ Image sent!" },
      { user: "Mitra", msg: data.diagnosis }
    ]);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mitra-container">

      <div className="chat-header">🌾 Mitra – Smart Farming Chat</div>

      <div className="chat-box">
        {messages.map((m, i) => (
          <ChatBubble key={i} user={m.user} msg={m.msg} />
        ))}
        <div ref={scrollRef}></div>
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
        />

        {/* Image Button */}
        <button
          className="icon-btn"
          onClick={() => fileRef.current.click()}
        >
          📷
        </button>

        <input
          type="file"
          ref={fileRef}
          onChange={(e) => handleImage(e.target.files[0])}
          style={{ display: "none" }}
        />

        {/* Mic Button */}
        <button
          className={`mic-btn ${recording ? "recording" : ""}`}
          onClick={() => setRecording(true)}
        >
          🎤
        </button>
      </div>

      {recording && (
        <VoiceRecorder onTranscription={handleVoice} />
      )}
    </div>
  );
};

export default MitraChat;