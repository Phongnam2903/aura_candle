import api from "../axiosInstance";
const BASE_URL = "/comments";

export async function commentForProductApi(productId, content, rating) {
    const res = await api.post(`${BASE_URL}/${productId}/comment`, { content, rating });
    return res.data;
}

export async function getCommentForProductApi(productId) {
    const res = await api.get(`${BASE_URL}/${productId}/comments`);
    return res.data;
}