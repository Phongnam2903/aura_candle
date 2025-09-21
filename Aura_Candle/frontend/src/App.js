import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RouterSeller from "./router/router-seller";
import HomeSeller from "./components/seller/home";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Routes>
        <Route path="/" element={<HomeSeller />} />
        <Route path="/Ecommerce/login" element={<LoginPage />} />
        <Route path="/Ecommerce/register" element={<RegisterPage />} />
        <Route path="/Ecommerce/seller/*" element={<RouterSeller />} />
      </Routes>

    </GoogleOAuthProvider>
  );
}

export default App;
