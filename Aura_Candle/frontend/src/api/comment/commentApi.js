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

export async function toggleLikeCommentApi(commentId) {
    const res = await api.patch(`${BASE_URL}/${commentId}/like`);
    return res.data;
}

export async function deleteCommentApi(commentId) {
    const res = await api.delete(`${BASE_URL}/${commentId}`);
    return res.data;
}