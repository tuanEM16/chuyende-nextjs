import httpAxios from './httpAxios';

const OrderDetailService = {
    index: async () => await httpAxios.get('orderdetail'),
    destroy: async (id) => await httpAxios.delete(`orderdetail/${id}`),
};

export default OrderDetailService;