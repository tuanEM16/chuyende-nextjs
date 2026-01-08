import httpAxios from './httpAxios';

const ADMIN_URL = 'admin/productstore';

const ProductStoreService = {

    index: () => httpAxios.get(ADMIN_URL),


    show: (id) => httpAxios.get(`${ADMIN_URL}/${id}`),


    store: (data) => httpAxios.post(ADMIN_URL, data),


    update: (id, data) => httpAxios.put(`${ADMIN_URL}/${id}`, data),


    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`)
};

export default ProductStoreService;