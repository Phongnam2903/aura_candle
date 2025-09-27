import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SellerLayout from "../layout/SellerLayout";
import Dashboard from "../components/seller/Dashboard";
import Products from "../components/seller/Products";
import Orders from "../components/seller/Orders";
import AddProduct from "../pages/Seller/AddProduct";
import OrderDetail from "../pages/Seller/OrderDetail";
import UpdateOrder from "../pages/Seller/UpdateOrder";


export default function SellerRoutes() {
    // Kiểm tra role từ localStorage
    const role = localStorage.getItem("role");
    if (role !== "seller") return <Navigate to="/login" replace />;

    return (
        <Routes>
            <Route element={<SellerLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/products/addProducts" element={<AddProduct />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/orders/:id/edit" element={<UpdateOrder />} />
            </Route>
        </Routes>
    );
}
