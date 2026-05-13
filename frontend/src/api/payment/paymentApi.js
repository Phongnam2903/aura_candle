import api from "../axiosInstance";

const BASE_URL = "/payment";

/**
 * Kiểm tra trạng thái thanh toán chung (theo orderId)
 * @param {string} orderId
 * @returns {Promise}
 */
export async function checkPaymentStatus(orderId) {
    const res = await api.get(`${BASE_URL}/status/${orderId}`);
    return res.data;
}

/**
 * Kiểm tra trạng thái thanh toán SePay (polling QR)
 * Frontend gọi mỗi 3 giây — trả về { status: 'PAID' } hoặc { status: 'PENDING' }
 * @param {string} orderCode - Mã đơn hàng dạng DH1234567890
 * @returns {Promise<{ status: 'PAID' | 'PENDING', orderCode: string }>}
 */
export async function checkSepayStatus(orderCode) {
    const res = await api.get(`${BASE_URL}/sepay/check-status/${orderCode}`);
    return res.data;
}


