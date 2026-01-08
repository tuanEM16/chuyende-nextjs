import httpAxios from './httpAxios';

const ADMIN_URL = 'admin/order';

const OrderService = {

    checkout: (data) => httpAxios.post('order/checkout', data),


    

    index: () => httpAxios.get(ADMIN_URL),


    show: (id) => httpAxios.get(`${ADMIN_URL}/${id}`),



    updateStatus: (id, status) => httpAxios.post(`${ADMIN_URL}/update/${id}`, { status }),


    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`),


    calculateTotal: (details) => {
        if (!details || details.length === 0) return 0;

        return details.reduce((acc, item) => {
            const amount = Number(item.amount);
            const price = Number(item.price);
            const qty = Number(item.qty);
            return acc + (amount || (price * qty));
        }, 0);
    }
};

export default OrderService;