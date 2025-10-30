import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * RoleBasedRedirect - Redirect user về dashboard phù hợp với role
 * Chỉ customer và khách (chưa login) mới được vào trang public
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component con (trang public)
 */
export default function RoleBasedRedirect({ children }) {
    const { role, isAuthenticated, loading } = useAuth();

    // Đang loading thì hiển thị loading spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B58D73]"></div>
            </div>
        );
    }

    // Nếu đã login và là seller hoặc admin → redirect về dashboard
    if (isAuthenticated()) {
        if (role === 'seller') {
            return <Navigate to="/seller/dashboard" replace />;
        }
        
        if (role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
    }

    // Customer hoặc chưa login → cho phép truy cập
    return children;
}

