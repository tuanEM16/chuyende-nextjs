import httpAxios from './httpAxios';

const OrderService = {
    index: async () => {
        return await httpAxios.get('order');
    },
    show: async (id) => {
        return await httpAxios.get(`order/${id}`);
    },
    // Tạo đơn hàng (Checkout)
    store: async (data) => {
        return await httpAxios.post('order', data);
    },
    // Cập nhật trạng thái đơn hàng (duyệt, hủy, giao hàng...)
    update: async (id, data) => {
        return await httpAxios.put(`order/${id}`, data);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`order/${id}`);
    }
};

export default OrderService;