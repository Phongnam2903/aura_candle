import api from "../axiosInstance";

export async function profileUser(id) {
    const res = await api.get(`/auth/profile/${id}`);
    return res.data;
}

export async function ChangeInformation(payload, id) {
    const res = await api.post(`/auth/changeInformation/${id}`, payload);
    return res.data;
}
