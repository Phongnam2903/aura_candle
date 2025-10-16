import api from "../axiosInstance";
const BASE_URL = "/notification";

export async function commentApi(notificationId, text) {
    const res = await api.post(`${BASE_URL}/${notificationId}/comment`, { text });
    return res.data; // backend trả về { ok: true, comment: {...} }
}
