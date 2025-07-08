import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client';
import Message from "./Message";
import { PaperAirplaneIcon, PhotoIcon } from '@heroicons/react/24/outline';
import EmojiPicker from "emoji-picker-react";
import "../App.css";
import { timeStamp } from 'console';

interface ChatProps {
    userName: string;
    onLogout: () => void;
}

const Chat: React.FC<ChatProps> = ({ userName, onLogout }) => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  // const [stompClient, setStompClient] = useState<any>(null);
  const stompClientRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const imageFileRef = useRef<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim())
      sendMessage();
  };

  const sendMessage = () => {
    const client = stompClientRef.current;

    if (!client || !client.connected) {
      console.warn("STOMP chưa kết nối");
      return;
    }

    // Nếu có ảnh
    if (imageFileRef.current) {
      const imgMessage = {
        sender: userName,
        content: imageFileRef.current,
        type: "IMAGE",
        timestamp: new Date().toISOString(),
      };
      client.send("/app/sendMessage", {}, JSON.stringify(imgMessage));
      imageFileRef.current = null; // reset ảnh sau khi gửi
      setImagePreview('');
    }

    // Nếu có text
    if (message.trim() !== "") {
      const textMessage = {
        sender: userName,
        content: message.trim(),
        type: "CHAT",
        timestamp: new Date().toISOString(),
      };
      client.send("/app/sendMessage", {}, JSON.stringify(textMessage));
      setMessage(""); // reset text sau khi gửi
    }

    inputRef.current?.focus();
  };
  

  const handleLogout = () => {
    if ( stompClientRef ) 
      console.log("Test: " + stompClientRef);
    stompClientRef.current.send("/app/leave", {}, JSON.stringify(userName));
    onLogout()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.send("/app/typing", {}, userName);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stompClientRef.current.send("/app/stopTyping", {}, userName);
    }, 1500);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://my-chatapp-d4lg.onrender.com/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const imageUrl = await response.text(); // backend trả về link ảnh
      imageFileRef.current = imageUrl;
      setImagePreview(imageUrl);
      console.log("Đã upload ảnh, url:", imageUrl);
    } catch (err) {
      console.error("Upload ảnh lỗi:", err);
    }
  };
  
  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  useEffect ( () => {
    const socket = new SockJS("https://my-chatapp-d4lg.onrender.com/chat-websocket");
    const client = Stomp.over(socket);

    client.connect( {}, () => {
      console.log("Connected to Websocket");
      client.send("/app/join", {}, JSON.stringify(userName));

      client.subscribe("/topic/messages", (msg) => {
        setMessages( (prev) => [...prev, JSON.parse(msg.body)])
      });

      client.subscribe("/topic/typing", (msg) => {
        const typingStatus = JSON.parse(msg.body);
        if (typingStatus.username !== userName) {
          setTypingUser(typingStatus.typing ? typingStatus.username : null);
        }
      });

      stompClientRef.current = client;
    });
      return () => {
        if (client) client.disconnect(); 
      }
  }, [userName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    console.log("click emoji!!");
    
    if (showEmojiPicker) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    // Dọn sự kiện khi unmount hoặc khi showEmojiPicker thay đổi
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showEmojiPicker]);
  

  // auto scroll
  useEffect( () => {
    if ( messagesEndRef.current ) {
      messagesEndRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col bg-white rounded-xl shadow-lg w-full sm:w-[29rem] h-[700px]">
        {/* Header */}
        <div className="p-4 bg-blue-500 text-white font-semibold text-center rounded-t-xl">
          Chat Room
        </div>

        {/* Message */}
        <div className="scroll-container flex-1 p-4 overflow-y-auto bg-gray-50 rounded-b-xl space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {message.type === "JOIN" ? (
                <div className="text-center text-green-500 italic">
                  {message.content}
                </div>
              ) : message.type === "LEAVE" ? (
                <div className="text-center text-red-500 italic">
                  {message.content}
                </div>
              ) : (
                <Message
                  sender={message.sender}
                  content={message.content}
                  isOwnMessage={message.sender === userName}
                  timestamp={message.timestamp}
                  type={message.type}
                />
              )}
            </div>
          ))}

          {typingUser && (
            <div className="text-sm italic text-black ml-4 pb-2">
              {typingUser} Is entering...
            </div>
          )}
          {imagePreview && (
            <div className="mb-2 ">
              <img
                src={imagePreview}
                alt="preview"
                className="max-w-xs rounded-md left-12"
              />
            </div>
          )}

          {/* Auto scroll marker */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-gray-50 rounded-b-xl">
          <div className="flex items-center space-x-4">
            {/* Input + Emoji */}
            <div className="flex-1 relative">
              <input
                className="w-full pr-10 pl-4 py-3 border border-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-300"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />

              <button
                type="button"
                onClick={(e) => {
                  setShowEmojiPicker((prev) => !prev);
                  e.stopPropagation();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-600"
              >
                😊
              </button>

              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-14 left-0 z-50"
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
            {/* Icon image */}
            <label
              htmlFor="imageUpload"
              className="cursor-pointer text-blue-500 hover:text-blue-700 w-8 h-8 "
            >
              <PhotoIcon />
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Send message */}
            <button onClick={sendMessage}>
              <PaperAirplaneIcon className="h-8 w-8 text-blue-500" />
            </button>
          </div>
        </div>

        {/* Button logout */}
        <div className="p-4 text-center border-t bg-gray-50">
          <button
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};





export default Chat;
