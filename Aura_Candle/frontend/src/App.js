import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import './index.css';
import ScrollToTop from "./components/Scroll/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import ChatWidget from "./components/features/chatbot/ChatWidget";
import AppRoutes from "./router/AppRoutes";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Container hiển thị toast */}
        <ToastContainer position="top-right" autoClose={2000} />
        <ScrollToTop />
        <AppRoutes />
        <ChatWidget />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
