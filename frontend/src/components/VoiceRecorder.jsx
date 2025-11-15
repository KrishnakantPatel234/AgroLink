import React, { useState, useRef } from "react";

const VoiceRecorder = ({ onStop }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      onStop(blob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      {!recording ? (
        <button 
          onClick={startRecording}
          style={{
            background: "#28a745",
            padding: "12px 20px",
            borderRadius: "10px",
            color: "white",
            border: "none",
            fontSize: "16px"
          }}
        >
          🎤 Start Speaking
        </button>
      ) : (
        <button 
          onClick={stopRecording}
          style={{
            background: "red",
            padding: "12px 20px",
            borderRadius: "10px",
            color: "white",
            border: "none",
            fontSize: "16px"
          }}
        >
          ⏹ Stop
        </button>
      )}
    </div>
  );
};

export default VoiceRecorder;
