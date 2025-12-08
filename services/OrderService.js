import httpAxios from './httpAxios';

const OrderService = {
    // Lấy danh sách
    index: async () => {
        return await httpAxios.get('order');
    },
    // Lấy chi tiết
    show: async (id) => {
        return await httpAxios.get(`order/${id}`);
    },
    // Cập nhật trạng thái (Dùng PUT)
    updateStatus: async (id, status) => {
        return await httpAxios.put(`order/${id}`, { status });
    },
    // Xóa đơn
    destroy: async (id) => {
        return await httpAxios.delete(`order/${id}`);
    },
    // Helper tính tổng tiền
    calculateTotal: (details) => {
        if (!details || details.length === 0) return 0;
        // Giả sử bảng detail có cột 'amount' (thành tiền) hoặc tính giá * số lượng
        return details.reduce((acc, item) => acc + (Number(item.amount) || (Number(item.price) * Number(item.qty))), 0);
    }
};

export default OrderService;