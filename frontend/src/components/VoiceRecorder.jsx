import React, { useState, useEffect } from "react";

const VoiceRecorder = ({ onTranscription }) => {
  const [recording, setRecording] = useState(false);
  let recognition;

  useEffect(() => {
    // Browser speech API
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser!");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "hi-IN"; // You can change based on the user
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false; // important = auto stop!
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();
    setRecording(true);
    console.log("🎤 Listening...");

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      console.log("📝 Recognized:", text);
      onTranscription(text); // send to chatbot
    };

    recognition.onspeechend = () => {
      console.log("⏹ Auto stopped.");
      recognition.stop();
      setRecording(false);
    };

    recognition.onerror = (err) => {
      console.error("Speech error:", err);
      setRecording(false);
    };
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      {!recording ? (
        <button
          onClick={startListening}
          style={{
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: 18,
          }}
        >
          🎤 Start Talking
        </button>
      ) : (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Listening… (auto-stop when you stop speaking)
        </p>
      )}
    </div>
  );
};

export default VoiceRecorder;
