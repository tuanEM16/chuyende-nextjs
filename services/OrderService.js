import httpAxios from "./httpAxios";

const ADMIN_URL = "admin/order";

const OrderService = {

    checkout: (payload) => httpAxios.post("order/checkout", payload),

    getHistory: () => httpAxios.get("order/history"),
    verifyVnpayReturn: (queryString) => {
        return httpAxios.get(`vnpay/return?${queryString}`);
    },
    updateAddress(orderId, payload) {


        return httpAxios.put(`/order/${orderId}/address`, payload);
    },


    cancel(orderId) {

        return httpAxios.put(`/order/${orderId}/cancel`);

    },


    getOrder: (orderId) => {
        return httpAxios.get(`order/${orderId}`);
    },
    updatePendingShipping(payload) {
        return httpAxios.put("/orders/pending-shipping", payload);
    },

    createVnpayUrl: (orderId) => {
        return httpAxios.post("vnpay/create-payment-url", { order_id: orderId });
    },



    updateStatus: (orderId, status) => {

        return httpAxios.post(`${ADMIN_URL}/update/${orderId}`, { status });
    },


    index: (params) => httpAxios.get(ADMIN_URL, { params }),

    show: (id) => httpAxios.get(`${ADMIN_URL}/${id}`),

    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`),

    calculateTotal: (details) => {
        if (!details || details.length === 0) return 0;
        return details.reduce((acc, item) => {
            const amount = Number(item.amount);
            const price = Number(item.price);
            const qty = Number(item.qty);
            return acc + (amount || price * qty);
        }, 0);
    },
};

export default OrderService;
