import React from "react";
import "../styles/bubbles.css";

const ChatBubble = ({ user, msg }) => {
  return (
    <div className={`bubble ${user === "You" ? "you" : "mitra"}`}>
      <div className="bubble-content">
        {msg}
      </div>
    </div>
  );
};

export default ChatBubble;
