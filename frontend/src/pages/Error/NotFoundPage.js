import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaArrowLeft } from 'react-icons/fa';

export default function NotFoundPage() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                {/* Card chính */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
                    {/* Icon Search với animation */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-8 shadow-lg">
                                <FaSearch className="text-white text-6xl" />
                            </div>
                        </div>
                    </div>

                    {/* Error Code */}
                    <div className="mb-4">
                        <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            404
                        </h1>
                    </div>

                    {/* Tiêu đề */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Không Tìm Thấy Trang
                    </h2>

                    {/* Thông báo chi tiết */}
                    <div className="mb-8">
                        <p className="text-gray-600 text-lg mb-4">
                            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <p className="text-blue-800 text-sm">
                                Vui lòng kiểm tra lại URL hoặc quay về trang chủ.
                            </p>
                        </div>

                        <p className="text-gray-500 text-sm">
                            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với chúng tôi.
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
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <FaHome />
                            <span>Về Trang Chủ</span>
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            Các trang phổ biến:
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2 text-sm">
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Trang chủ
                            </button>
                            <button
                                onClick={() => navigate('/product/category/all')}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Sản phẩm
                            </button>
                            <button
                                onClick={() => navigate('/blog')}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Blog
                            </button>
                            <button
                                onClick={() => navigate('/about')}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Về chúng tôi
                            </button>
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

