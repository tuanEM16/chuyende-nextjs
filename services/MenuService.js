import httpAxios from './httpAxios';

const MenuService = {
    index: async () => {
        return await httpAxios.get('menu');
    },
    show: async (id) => {
        return await httpAxios.get(`menu/${id}`);
    },
    store: async (data) => {
        return await httpAxios.post('menu', data);
    },
    update: async (id, data) => {
        return await httpAxios.put(`menu/${id}`, data);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`menu/${id}`);
    }
};

export default MenuService;