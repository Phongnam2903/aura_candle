import api from "../axiosInstance";
const BASE_URL = "/product";


export async function getProducts() {
    const res = await api.get(`${BASE_URL}/`);
    return res.data.products;
}

export async function getProductsByCategory(slug) {
    const res = await api.get(`${BASE_URL}/category/${slug}`);
    return res.data;
}

export async function createProducts(data) {
    const res = await api.post(`${BASE_URL}/`, data);
    return res.data;
}

export async function deleteProduct(id) {
    return api.delete(`${BASE_URL}/${id}`);
}

export async function updateProduct(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
}

export async function getProductById(id) {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
}

export async function searchProducts(keyword) {
    const res = await api.get(`${BASE_URL}/search?query=${encodeURIComponent(keyword)}`);
    return res.data;
}

export async function getProductsByCategoryApi(categoryId, excludeId) {
    const res = await api.get(`${BASE_URL}/related`, {
        params: { categoryId, excludeId } // phải dùng params để axios gửi query string
    });
    return res.data.products;
}

