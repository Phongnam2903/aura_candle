import api from "../axiosInstance";

const BASE_URL = "/orderSeller/seller-orders";
// Lấy danh sách đơn hàng của seller
export const getSellerOrders = async () => {
    const res = await api.get(BASE_URL);
    return res.data;
};

// Cập nhật trạng thái đơn hàng
export const updateSellerOrderStatus = async (orderId, status) => {
    const res = await api.put(BASE_URL, { orderId, status });
    return res.data;
};

