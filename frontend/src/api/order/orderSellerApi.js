import api from "../axiosInstance";

const BASE_URL = "/orderSeller/seller-orders";
// Lấy danh sách đơn hàng của seller
export const getSellerOrders = async () => {
    const res = await api.get(BASE_URL);
    return res.data;
};

// Cập nhật trạng thái đơn hàng
export const updateSellerOrderStatus = async (orderId, status, paymentStatus) => {
    const payload = { orderId };
    
    // Chỉ thêm status nếu có
    if (status) payload.status = status;
    
    // Chỉ thêm paymentStatus nếu có
    if (paymentStatus) payload.paymentStatus = paymentStatus;
    
    const res = await api.put(BASE_URL, payload);
    return res.data;
};

