import api from "../axiosInstance";

const BASE_URL = "/order";

const orderApi = {
    checkout: (payload) => {
        return api.post(`${BASE_URL}/checkout`, payload);
    },

    getMyOrders: () => {
        return api.get(`${BASE_URL}/my-orders`);
    },

    getOrderDetail: (orderId) => {
        return api.get(`${BASE_URL}/${orderId}`);
    },
};

export default orderApi;
