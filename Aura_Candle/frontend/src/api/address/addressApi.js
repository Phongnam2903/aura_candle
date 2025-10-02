import api from "../axiosInstance";

const BASE_URL = "/addresses"; 

// Lấy tất cả địa chỉ của user
export const getAddressesByUser = async (userId) => {
    const res = await api.get(`${BASE_URL}/${userId}`);
    return res.data;
};

// Lấy chi tiết 1 địa chỉ
export const getAddressById = async (id) => {
    const res = await api.get(`${BASE_URL}/detail/${id}`);
    return res.data;
};

// Tạo mới địa chỉ
export const createAddress = async (data) => {
    const res = await api.post(BASE_URL, data);
    return res.data;
};

// Cập nhật địa chỉ
export const updateAddress = async (id, data) => {
    const res = await api.put(`${BASE_URL}/${id}`, data);
    return res.data;
};

// Xóa địa chỉ
export const deleteAddress = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
};
