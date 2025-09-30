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
