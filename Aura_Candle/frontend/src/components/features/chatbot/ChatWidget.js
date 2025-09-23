import React, { useState } from "react";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([{ from: "bot", text: "Xin chào! Bạn thích mùi hương gì?" }]);

    const sendMessage = (text) => {
        setMessages([...messages, { from: "user", text }]);
        // Giả lập bot phản hồi
        setTimeout(() => setMessages(m => [...m, { from: "bot", text: "Gợi ý: Lavender thư giãn." }]), 500);
    };

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 bg-pink-600 text-white p-4 rounded-full shadow"
            >
                💬
            </button>

            {open && (
                <div className="fixed bottom-20 right-6 w-72 bg-white shadow-lg rounded p-3 flex flex-col">
                    <div className="flex-1 overflow-y-auto mb-3 max-h-64">
                        {messages.map((m, i) => (
                            <div key={i} className={m.from === "bot" ? "text-left" : "text-right"}>
                                <span className="inline-block my-1 px-2 py-1 bg-gray-100 rounded">{m.text}</span>
                            </div>
                        ))}
                    </div>
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Nhập tin nhắn..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}
