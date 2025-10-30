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
import BlogDetailScreen from "../pages/Blog/BlogDetailScreen";
import SellerRoutes from "./SellerRoutes";
import AdminRoutes from "./AdminRoutes";
import ProfileScreen from "../pages/Profile/ProfileScreen";
import ProductByCategory from "../pages/Product/ProductByCategory";
import AboutScreen from "../pages/About/About";
import NotificationDetailScreen from "../pages/Notification/NotificationDetail";
import NotificationListScreen from "../pages/Notification/NotificationListScreen";
import ResetPasswordScreen from "../pages/Auth/ResetPasswordScreen";
import UnauthorizedPage from "../pages/Error/UnauthorizedPage";
import NotFoundPage from "../pages/Error/NotFoundPage";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import RoleBasedRedirect from "../components/Auth/RoleBasedRedirect";

export default function AppRoutes() {
    return (
        <>
            <Routes>
                {/* Public Routes - Không cần đăng nhập */}
                {/* Home - Chỉ customer và khách, seller/admin auto redirect về dashboard */}
                <Route 
                    path="/" 
                    element={
                        <RoleBasedRedirect>
                            <HomeScreen />
                        </RoleBasedRedirect>
                    } 
                />
                <Route 
                    path="/product/:id" 
                    element={
                        <RoleBasedRedirect>
                            <ProductDetailScreen />
                        </RoleBasedRedirect>
                    } 
                />
                <Route 
                    path="/product/category/:slug" 
                    element={
                        <RoleBasedRedirect>
                            <ProductByCategory />
                        </RoleBasedRedirect>
                    } 
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
                <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
                <Route path="/blog" element={<BlogScreen />} />
                <Route path="/blog/:id" element={<BlogDetailScreen />} />
                <Route path="/about" element={<AboutScreen />} />
                
                {/* Error Pages */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Protected Routes - Yêu cầu đăng nhập */}
                <Route 
                    path="/cart" 
                    element={
                        <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                            <CartScreen />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/checkout" 
                    element={
                        <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                            <CheckOutScreen />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/profile/:id" 
                    element={
                        <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                            <ProfileScreen />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/notifications" 
                    element={
                        <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                            <NotificationListScreen />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/notification/:id" 
                    element={
                        <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                            <NotificationDetailScreen />
                        </ProtectedRoute>
                    } 
                />

                {/* Seller Routes - Chỉ seller */}
                <Route path="/seller/*" element={<SellerRoutes />} />

                {/* Admin Routes - Chỉ admin */}
                <Route path="/admin/*" element={<AdminRoutes />} />

                {/* 404 Not Found - Catch all routes */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>


        </>
    );
}
