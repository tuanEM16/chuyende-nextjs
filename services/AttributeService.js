import httpAxios from './httpAxios';

const AttributeService = {
    index: async () => {
        return await httpAxios.get('attribute');
    },
    show: async (id) => {
        return await httpAxios.get(`attribute/${id}`);
    },
    store: async (data) => {
        return await httpAxios.post('attribute', data);
    },
    update: async (id, data) => {
        return await httpAxios.put(`attribute/${id}`, data);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`attribute/${id}`);
    }
};

export default AttributeService;