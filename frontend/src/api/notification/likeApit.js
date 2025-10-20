import api from "../axiosInstance";
const BASE_URL = "/notification";

export async function toggleLikeNotification(notificationId) {
    const res = await api.post(`${BASE_URL}/${notificationId}/like`);
    return res.data;
}
