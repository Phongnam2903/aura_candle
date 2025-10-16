import api from "../axiosInstance";
const BASE_URL = "/notification";


export async function getNotifications() {
    const res = await api.get(`${BASE_URL}/`);
    return res.data.data;
}

export async function markAllRead() {
    const res = await api.put(`${BASE_URL}/mark-read`);
    return res.data;
}
