import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute - Component bảo vệ routes theo role
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component con sẽ render nếu có quyền
 * @param {string|string[]} props.allowedRoles - Role hoặc danh sách roles được phép truy cập
 * @param {string} props.redirectTo - Đường dẫn redirect khi không có quyền (mặc định: /login)
 * @param {boolean} props.requireAuth - Có yêu cầu đăng nhập hay không (mặc định: true)
 */
export default function ProtectedRoute({ 
    children, 
    allowedRoles = [], 
    redirectTo = '/login',
    requireAuth = true 
}) {
    const { isAuthenticated, role, loading } = useAuth();
    const location = useLocation();

    // Đang loading thì hiển thị loading spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B58D73]"></div>
            </div>
        );
    }

    // Kiểm tra yêu cầu đăng nhập
    if (requireAuth && !isAuthenticated()) {
        // Lưu location để redirect về sau khi login
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Kiểm tra role nếu có yêu cầu
    if (allowedRoles.length > 0) {
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        
        if (!roles.includes(role)) {
            // Redirect đến trang Unauthorized (403)
            return <Navigate to="/unauthorized" state={{ from: location }} replace />;
        }
    }

    // Có quyền truy cập -> render children
    return children;
}

