import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchChats, addChat } from "../Services/api";
import "./Layout.css";

const Layout = ({ children, onLogout, onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [newChatName, setNewChatName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await fetchChats();
        //   console.log(response);
        setChats(response);
        // window.location = "/";
      } catch (error) {
        console.log(error);
      }
    };
    loadChats();
  }, []);

  const handleChatClick = (chat) => {
    onSelectChat(chat);
    // navigate("/chat");
  };

  const handleAddChat = async () => {
    try {
      if (newChatName.trim()) {
        const response = await addChat({ name: newChatName });
        // console.log("response ", response);
        chats.push(response);
        setChats(chats);

        alert("Chat added successfully");
        // window.location = "/";
        setNewChatName("");
      }
    } catch (error) {
      console.log(error);
      alert("Error Adding Chat: " + error.message);
    }
  };

  //  console.log(JSON.stringify(chats, null, 2));

  return (
    <div className="layout">
      <nav className="sidebar">
        <h2>Chat App</h2>
        <ul>
          {chats ? (
            chats.map((chat) => (
              <li
                key={chat._id}
                onClick={async () => await handleChatClick(chat)}
              >
                {chat.title}
              </li>
            ))
          ) : (
            <h4>No Chats here</h4>
          )}
        </ul>
        <div className="add-chat">
          <input
            type="text"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            placeholder="New Chat"
          />
          <button onClick={handleAddChat}>Add Chat</button>
        </div>
      </nav>
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
