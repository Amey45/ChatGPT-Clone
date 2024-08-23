import React, { useEffect, useState } from "react";
import "./Message.css";
import axios from "axios";

const Message = ({ message }) => {
  const [name, setName] = useState("User");
  console.log(message);

  console.log(message);

  return message.messageType === "AI" ? (
    <div className="ai-message">
      <div className="message-sender">AI</div>
      <div className="message-text">{message.messageBody}</div>
      <div className="message-time">
        {new Date(message.createdAt).toLocaleTimeString()}
      </div>
    </div>
  ) : (
    <div className="user-message">
      <div className="message-sender">{name}</div>
      <div className="message-text">{message.messageBody}</div>
      <div className="message-time">
        {new Date(message.createdAt).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Message;
