/**
 * Auth Helper Functions
 * Các utility functions để hỗ trợ authentication
 */

/**
 * Kiểm tra xem user có đang đăng nhập không
 * @returns {boolean}
 */
export const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!token && !!user;
};

/**
 * Lấy thông tin user hiện tại từ localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

/**
 * Lấy role của user hiện tại
 * @returns {string|null}
 */
export const getCurrentUserRole = () => {
    return localStorage.getItem('role');
};

/**
 * Kiểm tra xem có phải role cụ thể không
 * @param {string} role - Role cần kiểm tra
 * @returns {boolean}
 */
export const hasRole = (role) => {
    return getCurrentUserRole() === role;
};

/**
 * Debug: Kiểm tra trạng thái auth
 * Log ra console tất cả auth data
 */
export const debugAuthState = () => {
    console.group('🔐 Auth State Debug');
    console.log('Token:', localStorage.getItem('token') ? '✅ Exists' : '❌ Missing');
    console.log('Role:', localStorage.getItem('role') || '❌ Missing');
    console.log('User:', getCurrentUser() || '❌ Missing');
    console.groupEnd();
};

/**
 * Kiểm tra xem localStorage có sạch sau khi logout không
 * @returns {Object} - Kết quả kiểm tra
 */
export const verifyLogoutClean = () => {
    const result = {
        isClean: true,
        remainingAuthData: []
    };

    const authKeys = ['token', 'role', 'user'];
    
    authKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            result.isClean = false;
            result.remainingAuthData.push(key);
        }
    });

    if (result.isClean) {
        console.log('✅ Logout verification: All auth data cleared');
    } else {
        console.warn('⚠️ Logout verification failed:', result.remainingAuthData);
    }

    return result;
};

