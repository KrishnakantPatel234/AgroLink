import React from "react";
import "../styles/mic.css";

const MicButton = ({ recording, onClick }) => {
  return (
    <button
      className={`mic-btn ${recording ? "recording" : ""}`}
      onClick={onClick}
    >
      🎤
    </button>
  );
};

export default MicButton;
