import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import SellerLayout from "../layout/SellerLayout";
import DashboardWithCharts from "../components/seller/DashboardWithCharts";
import Products from "../components/seller/Products";
import Orders from "../components/seller/Orders";
import AddProduct from "../pages/Seller/AddProduct";
import OrderDetail from "../pages/Seller/OrderDetail";
import UpdateOrder from "../pages/Seller/UpdateOrder";
import MaterialsPage from "../components/seller/Materials";
import AddMaterial from "../components/seller/AddMaterial";
import EditMaterial from "../components/seller/EditMaterial";
import EditProduct from "../pages/Seller/EditProduct";
import ProductDetail from "../pages/Seller/ProductDetail";
import CategoryList from "../components/seller/CategoryList";
import BlogList from "../pages/Seller/BlogList";
import CreateBlog from "../pages/Seller/CreateBlog";
import EditBlog from "../pages/Seller/EditBlog";
import BlogDetail from "../pages/Seller/BlogDetail";


export default function SellerRoutes() {
    return (
        <ProtectedRoute allowedRoles="seller">
            <Routes>
                <Route element={<SellerLayout />}>
                    <Route path="/dashboard" element={<DashboardWithCharts />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/products/addProducts" element={<AddProduct />} />
                    <Route path="/products/:id/edit" element={<EditProduct />} />
                    <Route path="/categories" element={<CategoryList />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/orders/:id/edit" element={<UpdateOrder />} />
                    <Route path="/materials" element={<MaterialsPage />} />
                    <Route path="/materials/new" element={<AddMaterial />} />
                    <Route path="/materials/:id/edit" element={<EditMaterial />} />
                    <Route path="/blogs" element={<BlogList />} />
                    <Route path="/blogs/create" element={<CreateBlog />} />
                    <Route path="/blogs/:id" element={<BlogDetail />} />
                    <Route path="/blogs/:id/edit" element={<EditBlog />} />
                </Route>
            </Routes>
        </ProtectedRoute>
    );
}
