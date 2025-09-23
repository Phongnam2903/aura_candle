import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import './index.css';
import ProductDetailScreen from "./pages/ProductDetailScreen";
import ScrollToTop from "./components/Scroll/ScrollToTop";
import Login from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/product/:id" element={<ProductDetailScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterScreen />} />;
        <Route path="/forgotpassword" element={<ForgotPasswordScreen/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
