import axios from "axios";

import CONFIG from "../config";

const api = axios.create({
    baseURL: CONFIG.API_URL,
    withCredentials: false, // vẫn false nếu không dùng cookie
});

//  Tự động thêm Authorization header cho mọi request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // token được lưu sau khi login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Xóa thông tin user khỏi localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");

            // Chuyển hướng về trang login
            // Lưu ý: window.location.href sẽ reload lại trang, đảm bảo state được reset sạch sẽ
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
