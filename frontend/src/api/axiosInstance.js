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

export default api;
