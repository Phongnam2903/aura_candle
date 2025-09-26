// src/components/features/chatbot/ChatWidget.jsx
import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Sparkles } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Xin chào! Tôi là chuyên gia tư vấn nến thơm. Bạn thích mùi hương như thế nào? 🌸",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      from: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Tuyệt vời! Gợi ý: nến thơm Lavender – mang lại cảm giác thư giãn và ấm áp ✨",
        "Bạn có thích hương hoa nhài hay oải hương? Đều rất phù hợp cho phòng ngủ 🌿",
        "Hương Vani giúp không gian thêm ngọt ngào, lý tưởng cho bữa tối gia đình 🤍",
        "Sandalwood và Citrus mang lại sự tươi mát và sảng khoái 💫",
      ];
      const random = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { from: "bot", text: random, timestamp: new Date() }]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Nút mở/đóng */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg flex items-center justify-center hover:scale-110 transition"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Cửa sổ chat */}
      {open && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Chuyên gia nến thơm</h3>
              <p className="text-xs text-white/80">Sẵn sàng tư vấn</p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end gap-2 max-w-[80%]">
                  {m.from === "bot" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow
                        ${
                          m.from === "bot"
                            ? "bg-white text-gray-800 rounded-bl-md"
                            : "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-md"
                        }`}
                    >
                      {m.text}
                    </div>
                    <div className={`text-xs text-gray-400 px-2 ${m.from === "user" ? "text-right" : "text-left"}`}>
                      {formatTime(m.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl shadow">Đang nhập...</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-purple-200">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-transparent outline-none text-sm"
                disabled={isTyping}
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    inputValue.trim() && !isTyping
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-110"
                      : "bg-gray-200 text-gray-400"
                  }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
