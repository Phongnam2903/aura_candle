import api from "../axiosInstance";

export async function getCart() {
    const res = await api.get("/cart");
    return res.data;
}

export async function addToCart(productId, quantity = 1) {
    const res = await api.post("/cart/add", { productId, quantity });
    return res.data;
}

export async function updateCart(productId, quantity) {
    const res = await api.put("/cart/update", { productId, quantity });
    return res.data;
}

export async function removeFromCart(productId) {
    const res = await api.delete(`/cart/${productId}`);
    return res.data;
}

/**
 * Merge danh sách items từ localStorage vào cart server.
 * Gọi ngay sau khi login thành công.
 * @param {Array} items - [{ productId, quantity }]
 */
export async function mergeCart(items) {
    const res = await api.post("/cart/merge", { items });
    return res.data;
}

export async function clearCart() {
    const res = await api.delete("/cart/clear");
    return res.data;
}
