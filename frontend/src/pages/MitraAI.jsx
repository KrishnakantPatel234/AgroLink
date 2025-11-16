import React, { useState, useRef, useEffect } from "react";
import VoiceRecorder from "../components/VoiceRecorder";
import MicButton from "../components/MicButton";
import ChatBubble from "../components/ChatBubble";
import WaveAnimation from "../components/WaveAnimation";
import "../styles/mitra.css";

const MitraAI = () => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const sendToChatbot = async (text) => {
    setMessages(prev => [...prev, { user: "You", msg: text }]);
    setLoading(true);

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
    setLoading(false);
  };

  const handleTranscription = (text) => {
    sendToChatbot(text);
    setRecording(false); // reset mic button
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mitra-container">
      <h2>🌾 Mitra – Smart Agriculture AI</h2>

      <div className="chat-area">
        {messages.map((m, i) => (
          <ChatBubble key={i} user={m.user} msg={m.msg} />
        ))}

        {loading && <ChatBubble user="Mitra" msg="⏳ Mitra soch raha hai..." />}
        <div ref={scrollRef}></div>
      </div>

      {recording && <WaveAnimation />}

      <MicButton
        recording={recording}
        onClick={() => setRecording(true)}
      />

      {recording && (
        <VoiceRecorder onTranscription={handleTranscription} />
      )}
    </div>
  );
};

export default MitraAI;
