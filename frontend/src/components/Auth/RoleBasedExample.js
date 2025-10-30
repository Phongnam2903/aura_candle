import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Component Example: Hiển thị UI khác nhau theo role
 * Đây là ví dụ minh họa cách sử dụng AuthContext
 */
export default function RoleBasedExample() {
    const { user, role, isAuthenticated, hasRole, hasAnyRole, logout } = useAuth();
    const navigate = useNavigate();

    // Nếu chưa login
    if (!isAuthenticated()) {
        return (
            <div className="p-8 bg-gray-100 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Đăng nhập
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* Thông tin user - Hiển thị cho tất cả đã login */}
            <div className="mb-6 p-4 bg-blue-50 rounded">
                <h2 className="text-xl font-semibold mb-2">Thông tin người dùng</h2>
                <p><strong>Tên:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> <span className="px-2 py-1 bg-blue-200 rounded">{role}</span></p>
            </div>

            {/* Admin Features - Chỉ admin thấy */}
            {hasRole('admin') && (
                <div className="mb-6 p-4 bg-red-50 rounded border-2 border-red-200">
                    <h2 className="text-xl font-semibold mb-2 text-red-700">
                        🔐 Admin Panel
                    </h2>
                    <p className="mb-4">Bạn có quyền quản trị viên</p>
                    <div className="space-x-2">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Admin Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Quản lý Users
                        </button>
                    </div>
                </div>
            )}

            {/* Seller Features - Chỉ seller thấy */}
            {hasRole('seller') && (
                <div className="mb-6 p-4 bg-green-50 rounded border-2 border-green-200">
                    <h2 className="text-xl font-semibold mb-2 text-green-700">
                        🏪 Seller Panel
                    </h2>
                    <p className="mb-4">Bạn có quyền người bán</p>
                    <div className="space-x-2">
                        <button
                            onClick={() => navigate('/seller/dashboard')}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Seller Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/seller/products')}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Quản lý Sản phẩm
                        </button>
                    </div>
                </div>
            )}

            {/* Customer Features - Chỉ customer thấy */}
            {hasRole('customer') && (
                <div className="mb-6 p-4 bg-purple-50 rounded border-2 border-purple-200">
                    <h2 className="text-xl font-semibold mb-2 text-purple-700">
                        🛒 Customer Panel
                    </h2>
                    <p className="mb-4">Bạn là khách hàng</p>
                    <div className="space-x-2">
                        <button
                            onClick={() => navigate('/cart')}
                            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                            Giỏ hàng
                        </button>
                        <button
                            onClick={() => navigate('/profile/' + user?._id)}
                            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                            Hồ sơ
                        </button>
                    </div>
                </div>
            )}

            {/* Features cho Seller hoặc Admin */}
            {hasAnyRole(['seller', 'admin']) && (
                <div className="mb-6 p-4 bg-yellow-50 rounded border-2 border-yellow-200">
                    <h2 className="text-xl font-semibold mb-2 text-yellow-700">
                        ⭐ Advanced Features
                    </h2>
                    <p>Tính năng này chỉ dành cho Seller và Admin</p>
                </div>
            )}

            {/* Logout Button - Tất cả user đều thấy */}
            <div className="mt-6 pt-6 border-t">
                <button
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}

