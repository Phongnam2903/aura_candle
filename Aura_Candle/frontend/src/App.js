import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import './index.css';
import ProductDetailScreen from "./pages/ProductDetailScreen";
import ScrollToTop from "./components/Scroll/ScrollToTop";
import Login from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import CartScreen from "./pages/CartScreen";
import CheckOutScreen from "./pages/CheckoutScreen";
import BlogScreen from "./pages/BlogScreen";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductDetailScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterScreen />} />;
          <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/checkout" element={<CheckOutScreen />} />
          <Route path="/blog" element={<BlogScreen />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
