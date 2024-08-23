import React, { useState, useEffect } from "react";
import { fetchMessages, sendMessage } from "../Services/api";
import Message from "../Components/Message";
import Layout from "../Components/Layout";
import "./ChatWindow.css";
import { json } from "react-router-dom";

const ChatWindow = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (selectedChat && !newMessage) {
      const loadMessages = async () => {
        const response = await fetchMessages(selectedChat._id);
        console.log("fetch message response", response);
        setMessages(response);
      };
      loadMessages();
    }
  }, [selectedChat]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  const handleSendMessage = async () => {
    console.log("newMessage: ", newMessage);
    try {
      if (newMessage.trim()) {
        const response = await sendMessage(selectedChat._id, {
          messageBody: newMessage,
        });
        const responseArray = [];
        responseArray.push(response.message, response.replyMessage);
        // console.log("messsages", JSON.stringify(messages, null, 4));
        if (messages && messages.length > 0) {
          console.log("response", response);
          setMessages([...messages, ...responseArray]);
        } else {
          console.log("response", response);
          setMessages([...responseArray]);
          // setMessages([...messages, response.message]);
          // setMessages([...messages, response.replyMessage]);
        }
        setNewMessage("");
        // window.location = "/";
      }
    } catch (error) {

      alert("error while sending message "+ error.message)
      console.log(error);
    }
  };

  const findIndex = (a) => {
    return messages.findIndex((message) => {
      return message === a;
    });
  };

  return (
    <>
      <Layout onSelectChat={setSelectedChat}>
        <div className="chat-container">
          {selectedChat ? (
            <div className="chat-messages">
              <div className="message-list">
                {messages &&
                  messages.map((msg) => (
                    <>
                      <Message key={findIndex(msg)} message={msg} />
                      <br />
                    </>
                  ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          ) : (
            <div className="no-chat-selected">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </Layout>

      <button
        style={{
          position: "absolute",
          top: "10px",
          right: "5px",
          padding: "10px",
          // marginBottom: "10px",
          background: "red",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );
};

export default ChatWindow;
