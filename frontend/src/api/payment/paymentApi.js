import api from "../axiosInstance";

const BASE_URL = "/payment";

/**
 * Tạo thanh toán VNPay
 * @param {Object} data - { orderId, amount, orderDescription, bankCode }
 * @returns {Promise}
 */
export async function createVNPayPayment(data) {
    const res = await api.post(`${BASE_URL}/vnpay/create`, data);
    return res.data;
}

/**
 * Tạo thanh toán Momo
 * @param {Object} data - { orderId, orderDescription }
 * @returns {Promise}
 */
export async function createMomoPayment(data) {
    const res = await api.post(`${BASE_URL}/momo/create`, data);
    return res.data;
}

/**
 * Kiểm tra trạng thái thanh toán
 * @param {string} orderId 
 * @returns {Promise}
 */
export async function checkPaymentStatus(orderId) {
    const res = await api.get(`${BASE_URL}/status/${orderId}`);
    return res.data;
}

