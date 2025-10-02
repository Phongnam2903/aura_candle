import api from "../axiosInstance";

const BASE_URL = "/order";

// Tạo đơn hàng mới (checkout)
export const checkout = async (data) => {
    const res = await api.post(`${BASE_URL}/checkout`, data);
    return res.data;
};

// Lấy danh sách đơn hàng của user
export const getMyOrders = async () => {
    const res = await api.get(`${BASE_URL}/my-orders`);
    return res.data;
};

// Lấy chi tiết 1 đơn hàng
export const getOrderDetail = async (orderId) => {
    const res = await api.get(`${BASE_URL}/${orderId}`);
    return res.data;
};
