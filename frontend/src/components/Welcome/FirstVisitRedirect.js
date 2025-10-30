import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * FirstVisitRedirect
 * Component để redirect người dùng lần đầu vào trang About
 */
export default function FirstVisitRedirect() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Kiểm tra xem đã visit website chưa
        const hasVisited = localStorage.getItem('hasVisitedWebsite');
        
        // Chỉ redirect nếu:
        // 1. Chưa từng visit
        // 2. Đang ở trang home (/)
        // 3. Không phải đang ở trang about
        if (!hasVisited && location.pathname === '/' && location.pathname !== '/about') {
            // Set flag đã visit
            localStorage.setItem('hasVisitedWebsite', 'true');
            
            // Redirect đến trang About
            navigate('/about', { replace: true });
        }
    }, [navigate, location]);

    return null; // Component này không render gì
}

