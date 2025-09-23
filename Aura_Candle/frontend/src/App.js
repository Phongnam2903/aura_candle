import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import './index.css';
import ProductDetailScreen from "./pages/ProductDetailScreen";
import ScrollToTop from "./components/Scroll/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/product/:id" element={<ProductDetailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
