import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

// Admin Components (sẽ tạo sau)
// import AdminLayout from "../layout/AdminLayout";
// import AdminDashboard from "../pages/Admin/Dashboard";
// import UserManagement from "../pages/Admin/UserManagement";
// import ProductManagement from "../pages/Admin/ProductManagement";
// import OrderManagement from "../pages/Admin/OrderManagement";

// Temporary placeholder components
const AdminPlaceholder = ({ title }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800">Admin - {title}</h1>
            <p className="text-gray-600 mt-2">Trang này đang được phát triển...</p>
        </div>
    </div>
);

export default function AdminRoutes() {
    return (
        <ProtectedRoute allowedRoles="admin">
            <Routes>
                {/* <Route element={<AdminLayout />}> */}
                <Route path="/dashboard" element={<AdminPlaceholder title="Dashboard" />} />
                <Route path="/users" element={<AdminPlaceholder title="Quản lý người dùng" />} />
                <Route path="/products" element={<AdminPlaceholder title="Quản lý sản phẩm" />} />
                <Route path="/orders" element={<AdminPlaceholder title="Quản lý đơn hàng" />} />
                <Route path="/categories" element={<AdminPlaceholder title="Quản lý danh mục" />} />
                <Route path="/blogs" element={<AdminPlaceholder title="Quản lý blog" />} />
                <Route path="/materials" element={<AdminPlaceholder title="Quản lý nguyên liệu" />} />
                {/* </Route> */}
            </Routes>
        </ProtectedRoute>
    );
}

