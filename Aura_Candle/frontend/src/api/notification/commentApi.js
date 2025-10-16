import api from "../axiosInstance";
const BASE_URL = "/notification";

export async function commentApi(notificationId, text, stars) {
    const res = await api.post(`${BASE_URL}/${notificationId}/comment`, { text, stars });
    return res.data;
}