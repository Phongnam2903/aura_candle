import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SellerLayout from "../layout/SellerLayout";
import Dashboard from "../components/seller/Dashboard";
import Products from "../components/seller/Products";
import Orders from "../components/seller/Orders";
import AddProduct from "../pages/Seller/AddProduct";
import OrderDetail from "../pages/Seller/OrderDetail";
import UpdateOrder from "../pages/Seller/UpdateOrder";
import MaterialsPage from "../components/seller/Materials";
import AddMaterial from "../components/seller/AddMaterial";
import EditMaterial from "../components/seller/EditMaterial";


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
                <Route path="/materials" element={<MaterialsPage />} />
                <Route path="/materials/new" element={<AddMaterial />} />
                <Route path="/materials/:id/edit" element={<EditMaterial />} />
            </Route>
        </Routes>
    );
}
