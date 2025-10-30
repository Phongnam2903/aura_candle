import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaHome, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function UnauthorizedPage() {
    const navigate = useNavigate();
    const { user, role, isAuthenticated } = useAuth();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        // Redirect về trang phù hợp với role
        if (isAuthenticated()) {
            switch (role) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'seller':
                    navigate('/seller/dashboard');
                    break;
                default:
                    navigate('/');
                    break;
            }
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                {/* Card chính */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
                    {/* Icon Lock với animation */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-red-500 to-red-600 rounded-full p-8 shadow-lg">
                                <FaLock className="text-white text-6xl" />
                            </div>
                        </div>
                    </div>

                    {/* Error Code */}
                    <div className="mb-4">
                        <h1 className="text-8xl font-bold text-gray-300">403</h1>
                    </div>

                    {/* Tiêu đề */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Không Có Quyền Truy Cập
                    </h2>

                    {/* Thông báo chi tiết */}
                    <div className="mb-8">
                        <p className="text-gray-600 text-lg mb-4">
                            Xin lỗi, bạn không có quyền truy cập vào trang này.
                        </p>
                        
                        {isAuthenticated() ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <p className="text-yellow-800 text-sm">
                                    <strong>Tài khoản hiện tại:</strong> {user?.name || 'Unknown'}
                                </p>
                                <p className="text-yellow-800 text-sm">
                                    <strong>Vai trò:</strong> <span className="uppercase font-semibold">{role}</span>
                                </p>
                            </div>
                        ) : (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <p className="text-blue-800 text-sm">
                                    Bạn cần đăng nhập với tài khoản có quyền phù hợp để truy cập trang này.
                                </p>
                            </div>
                        )}

                        <p className="text-gray-500 text-sm">
                            Trang này chỉ dành cho những người dùng có quyền truy cập đặc biệt.
                            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với quản trị viên.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 hover:scale-105"
                        >
                            <FaArrowLeft />
                            <span>Quay Lại</span>
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B58D73] to-[#9F7B60] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <FaHome />
                            <span>{isAuthenticated() ? 'Về Trang Chủ' : 'Đăng Nhập'}</span>
                        </button>
                    </div>

                    {/* Phân quyền giải thích */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            Các cấp độ truy cập:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <p className="font-semibold text-purple-700">👤 Customer</p>
                                <p className="text-purple-600 mt-1">Mua sắm, giỏ hàng, đơn hàng</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="font-semibold text-green-700">🏪 Seller</p>
                                <p className="text-green-600 mt-1">Quản lý sản phẩm, đơn hàng</p>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="font-semibold text-red-700">🔑 Admin</p>
                                <p className="text-red-600 mt-1">Quản trị toàn bộ hệ thống</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-500 text-sm">
                        © 2025 Aura Candle. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

