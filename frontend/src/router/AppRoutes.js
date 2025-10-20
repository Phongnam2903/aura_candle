import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeScreen from "../pages/Home/HomeScreen";
import ProductDetailScreen from "../pages/Product/ProductDetailScreen";
import Login from "../pages/Auth/LoginScreen";
import RegisterScreen from "../pages/Auth/RegisterScreen";
import ForgotPasswordScreen from "../pages/Auth/ForgotPasswordScreen";
import CartScreen from "../pages/Cart/CartScreen";
import CheckOutScreen from "../pages/Cart/CheckoutScreen";
import BlogScreen from "../pages/Blog/BlogScreen";
import SellerRoutes from "./SellerRoutes";
import ProfileScreen from "../pages/Profile/ProfileScreen";
import ProductByCategory from "../pages/Product/ProductByCategory";
import AboutScreen from "../pages/About/About";
import NotificationDetailScreen from "../pages/Notification/NotificationDetail";
import ResetPasswordScreen from "../pages/Auth/ResetPasswordScreen";

export default function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/product/:id" element={<ProductDetailScreen />} />
                <Route path="/product/category/:slug" element={<ProductByCategory />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
                <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/checkout" element={<CheckOutScreen />} />
                <Route path="/blog" element={<BlogScreen />} />
                <Route path="/profile/:id" element={<ProfileScreen />} />
                <Route path="/about" element={<AboutScreen />} />

                <Route path="/notification/:id" element={<NotificationDetailScreen />} />

                {/*  Gộp seller routes vào đây */}
                <Route path="/seller/*" element={<SellerRoutes />} />
            </Routes>


        </>
    );
}
