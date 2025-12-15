import httpAxios from './httpAxios';

const ProductStoreService = {
    index: async () => {
        return await httpAxios.get('productstore');
    },
    store: async (data) => {
        return await httpAxios.post('productstore', data);
    },
    update: async (id, data) => {
        return await httpAxios.put(`productstore/${id}`, data);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`productstore/${id}`);
    },
    show: async (id) => {
        return await httpAxios.get(`productstore/${id}`);
    }
};

export default ProductStoreService;