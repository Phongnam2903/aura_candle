// src/components/features/chatbot/ChatWidget.jsx
// VERSION WITH MODE SELECTOR - User có thể chọn Rule-based, Ollama, hoặc Hybrid
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, X, MessageCircle, Sparkles, Wind, Settings } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Xin chào! Tôi là chuyên gia tư vấn nến thơm 🌸. Bạn thích mùi hương như thế nào?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [shopContext, setShopContext] = useState(null);
  const [botMode, setBotMode] = useState('hybrid'); // 'rule-based', 'ollama', 'hybrid'
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Khi mở chat thì focus ô nhập
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Gửi tin nhắn
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Thêm tin nhắn của người dùng
    const userMessage = {
      from: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Build conversation history cho OpenAI (chỉ cần role + content)
      const conversationHistory = messages.map(m => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text
      }));

      // Chọn endpoint dựa trên mode
      const endpoint = `http://localhost:5000/chat/${botMode}`;
      console.log(`🤖 Using mode: ${botMode}`);

      // Gọi API tới backend với conversation history
      const res = await axios.post(endpoint, {
        message: text,
        conversationHistory: conversationHistory,
      });

      // Lấy phản hồi của bot và shop context
      const botReply = res.data.reply;
      const newShopContext = res.data.shopContext;
      const source = res.data.source || botMode;

      // Lưu shop context (fragrances, categories)
      if (newShopContext) {
        setShopContext(newShopContext);
      }

      // Hiển thị tin nhắn bot
      setMessages((prev) => [
        ...prev,
        { 
          from: "bot", 
          text: botReply, 
          timestamp: new Date(),
          source: source // Để biết bot dùng backend nào
        },
      ]);
    } catch (error) {
      console.error("Lỗi khi gọi API chatbot:", error);
      
      let errorMsg = "Xin lỗi, hiện tại tôi đang gặp chút trục trặc 😅.";
      
      if (error.response?.status === 503) {
        errorMsg = error.response.data.error + "\n\n💡 Tip: Chuyển sang mode 'Rule-based' để dùng ngay!";
      }
      
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: errorMsg,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Enter để gửi
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  // Mode labels
  const modeLabels = {
    'rule-based': '📋 Rule-based (Nhanh)',
    'ollama': '🦙 Ollama (Thông minh)',
    'hybrid': '🎯 Hybrid (Tự động)'
  };

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
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Chuyên gia nến thơm</h3>
                  <p className="text-xs text-white/80">{modeLabels[botMode]}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="mt-3 p-3 bg-white/10 rounded-lg backdrop-blur">
                <p className="text-xs mb-2">Chọn chế độ bot:</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setBotMode('rule-based'); setShowSettings(false); }}
                    className={`text-xs px-3 py-2 rounded-lg text-left transition ${
                      botMode === 'rule-based' 
                        ? 'bg-white text-purple-600 font-semibold' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    📋 Rule-based - Nhanh, Free
                  </button>
                  <button
                    onClick={() => { setBotMode('ollama'); setShowSettings(false); }}
                    className={`text-xs px-3 py-2 rounded-lg text-left transition ${
                      botMode === 'ollama' 
                        ? 'bg-white text-purple-600 font-semibold' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    🦙 Ollama - Thông minh (cần setup)
                  </button>
                  <button
                    onClick={() => { setBotMode('hybrid'); setShowSettings(false); }}
                    className={`text-xs px-3 py-2 rounded-lg text-left transition ${
                      botMode === 'hybrid' 
                        ? 'bg-white text-purple-600 font-semibold' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    🎯 Hybrid - Tự động chọn
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tin nhắn */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2 max-w-[80%]">
                  {m.from === "bot" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow
                        ${m.from === "bot"
                          ? "bg-white text-gray-800 rounded-bl-md"
                          : "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-md"
                        }`}
                    >
                      {m.text}
                    </div>
                    <div
                      className={`text-xs text-gray-400 px-2 flex items-center gap-1 ${
                        m.from === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {formatTime(m.timestamp)}
                      {m.source && m.from === "bot" && (
                        <span className="text-[10px] opacity-60">• {m.source}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl shadow">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (nếu vừa mở chat) */}
          {messages.length <= 1 && !isTyping && (
            <div className="px-4 pb-2 bg-gray-50/50 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-medium">💡 Gợi ý câu hỏi:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Có mùi nào thơm nhẹ nhẹ không?",
                  "Tặng sinh nhật nên chọn gì?",
                  "Nến giá bao nhiêu?",
                  "Có mùi hoa hồng không?"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 bg-white border border-purple-200 rounded-full hover:bg-purple-50 hover:border-purple-300 transition text-gray-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Available Fragrances (nếu có) */}
          {shopContext?.availableFragrances?.length > 0 && (
            <div className="px-4 pb-2 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-purple-500" />
                <p className="text-xs font-semibold text-gray-700">Mùi hương có sẵn:</p>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {shopContext.availableFragrances.slice(0, 12).map((fragrance, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-white rounded-full text-purple-700 border border-purple-200 shadow-sm"
                  >
                    {fragrance}
                  </span>
                ))}
                {shopContext.availableFragrances.length > 12 && (
                  <span className="text-xs px-2 py-1 text-gray-500">
                    +{shopContext.availableFragrances.length - 12} mùi khác
                  </span>
                )}
              </div>
            </div>
          )}

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
                  ${inputValue.trim() && !isTyping
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

