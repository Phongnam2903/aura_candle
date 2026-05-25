import api from "../axiosInstance";

const BASE_URL = "/orderSeller/seller-orders";
// Lấy danh sách đơn hàng của seller với filter từ backend
export const getSellerOrders = async ({ paymentStatus, search } = {}) => {
    const params = {};
    if (paymentStatus && paymentStatus !== "all") params.paymentStatus = paymentStatus;
    if (search && search.trim()) params.search = search.trim();

    const res = await api.get(BASE_URL, { params });
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

