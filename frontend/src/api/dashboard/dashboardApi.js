import api from "../axiosInstance";
const BASE_URL = "/dashboard";

export async function getSellerDashboardStats(productId) {
    const res = await api.get(`${BASE_URL}/seller`);
    return res.data;
}