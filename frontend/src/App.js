// src/App.jsx
import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./index.css";
import ScrollToTop from "./components/Scroll/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ChatWidget from "./components/features/chatbot/ChatWidget";
import AppRoutes from "./router/AppRoutes";

// Tách riêng component để dùng hook useLocation
function AppContent() {
  const location = useLocation();
  const path = location.pathname;

  // Ẩn ChatWidget nếu đang trong seller hoặc admin
  const hideChat = path.startsWith("/seller") || path.startsWith("/admin");

  return (
    <>
      {/* Toast thông báo */}
      <ToastContainer position="top-right" autoClose={2000} />
      <ScrollToTop />
      <AppRoutes />
      {!hideChat && <ChatWidget />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
