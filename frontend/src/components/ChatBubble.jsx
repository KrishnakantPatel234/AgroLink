import React from "react";
import "../styles/bubbles.css";

const ChatBubble = ({ user, msg }) => {
  return (
    <div className={user === "You" ? "bubble you" : "bubble mitra"}>
      <strong>{user}:</strong> {msg}
    </div>
  );
};

export default ChatBubble;
