import api from "../axiosInstance";

// Lấy danh sách category
export async function getCategories() {
    const res = await api.get("/category");
    return res.data; 
}
