/**
 * Global Configuration
 * Lưu trữ các biến cấu hình chung cho toàn bộ ứng dụng
 */

const CONFIG = {
    // API URL: Ưu tiên lấy từ biến môi trường, nếu không có thì dùng localhost
    API_URL: process.env.REACT_APP_API_URL || "http://localhost:5000",

    // Các cấu hình khác có thể thêm vào đây (VD: Timeout, Pagination limit...)
    TIMEOUT: 10000,
};

export default CONFIG;
