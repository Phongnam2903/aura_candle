import api from "../axiosInstance";

const BASE_URL = "/blog";

// Lấy tất cả blogs (public)
export const getAllBlogs = async () => {
    const res = await api.get(`${BASE_URL}`);
    return res.data;
};

// Lấy blogs của seller
export const getSellerBlogs = async () => {
    const res = await api.get(`${BASE_URL}/seller/my-blogs`);
    return res.data;
};

// Lấy chi tiết 1 blog
export const getBlogById = async (blogId) => {
    const res = await api.get(`${BASE_URL}/${blogId}`);
    return res.data;
};

// Tạo blog mới
export const createBlog = async (blogData) => {
    const res = await api.post(`${BASE_URL}`, blogData);
    return res.data;
};

// Cập nhật blog
export const updateBlog = async (blogId, blogData) => {
    const res = await api.put(`${BASE_URL}/${blogId}`, blogData);
    return res.data;
};

// Xóa blog
export const deleteBlog = async (blogId) => {
    const res = await api.delete(`${BASE_URL}/${blogId}`);
    return res.data;
};

