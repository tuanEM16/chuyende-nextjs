import httpAxios from './httpAxios';

const ADMIN_URL = 'admin/orderdetail';

const OrderDetailService = {

    index: () => httpAxios.get(ADMIN_URL),


    show: (id) => httpAxios.get(`${ADMIN_URL}/${id}`),


    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`)
};

export default OrderDetailService;