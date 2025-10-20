import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
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
