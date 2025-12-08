import httpAxios from './httpAxios';

const ProductAttributeService = {
    index: async () => await httpAxios.get('productattribute'),
    store: async (data) => await httpAxios.post('productattribute', data),
    destroy: async (id) => await httpAxios.delete(`productattribute/${id}`),
};

export default ProductAttributeService;