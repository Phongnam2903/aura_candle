import React, { useState } from 'react';
import { FaInfoCircle, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * RoleInfoBanner - Thông báo cho Seller/Admin về việc truy cập trang home
 * Hiển thị banner nhỏ thông báo: "Muốn xem trang home? Vui lòng đăng xuất"
 */
export default function RoleInfoBanner() {
    const { role, logout } = useAuth();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);

    // Kiểm tra đã dismiss banner chưa (lưu trong localStorage)
    const storageKey = `role-banner-dismissed-${role}`;
    const isDismissed = localStorage.getItem(storageKey);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(storageKey, 'true');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Không hiển thị nếu đã dismiss hoặc không visible
    if (isDismissed || !isVisible) {
        return null;
    }

    // Chỉ hiển thị cho seller và admin
    if (role !== 'seller' && role !== 'admin') {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <FaInfoCircle className="text-blue-500 text-xl mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">
                            💡 Thông tin quan trọng
                        </h3>
                        <p className="text-sm text-gray-700">
                            Bạn đang đăng nhập với vai trò <strong className="text-blue-600">{role === 'seller' ? 'Seller' : 'Admin'}</strong>. 
                            Trang home và sản phẩm chỉ dành cho khách hàng.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Muốn xem trang home? 
                            <button
                                onClick={handleLogout}
                                className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium underline"
                            >
                                <FaSignOutAlt className="text-xs" />
                                Đăng xuất ngay
                            </button>
                        </p>
                    </div>
                </div>
                
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0"
                    title="Đóng thông báo"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
}

