import api from "../axiosInstance";
const BASE_URL = "/product";


export async function getProducts() {
    const res = await api.get(`${BASE_URL}/`);
    return res.data.products;
}

export async function createProducts(data) {
    const res = await api.post(`${BASE_URL}/`, data);
    return res.data;
}

// export async function deleteMaterial(id) {
//     return api.delete(`${BASE_URL}/${id}`);
// }

// export async function updateMaterial(id, data) {
//     return api.put(`${BASE_URL}/${id}`, data);
// }

// export async function getMaterialById(id) {
//     const res = await api.get(`${BASE_URL}/${id}`);
//     return res.data;
// }