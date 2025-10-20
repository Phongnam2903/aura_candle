import api from "../axiosInstance";
const BASE_URL = "/notification";

// Lấy danh sách thông báo của user
export async function getNotifications() {
    const res = await api.get(`${BASE_URL}/`);
    // Nếu backend trả về { data: [...] } thì như bạn viết là đúng
    // Nhưng nếu backend trả về trực tiếp là mảng thì cần sửa thành:
    return res.data.data || res.data;
}

//  Đánh dấu tất cả thông báo là đã đọc
export async function markAllRead() {
    const res = await api.put(`${BASE_URL}/mark-read`);
    return res.data;
}

//  Đánh dấu 1 thông báo là đã đọc (click từng cái)
export async function markNotificationAsRead(id) {
    const res = await api.put(`${BASE_URL}/mark-read/${id}`);
    return res.data;
}
