import api from "../axiosInstance";

// Lấy danh sách category
export async function getCategories() {
    const res = await api.get("/category");
    return res.data;
}

// Tạo category mới
export async function createCategory(payload) {
    const res = await api.post("/category", payload);
    return res.data;
}

// Cập nhật category
export async function updateCategory(id, payload) {
    const res = await api.put(`/category/${id}`, payload);
    return res.data;
}

// Xóa category
export async function deleteCategory(id) {
    const res = await api.delete(`/category/${id}`);
    return res.data;
}

// Upload ảnh
export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("files", file);

    const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
}
