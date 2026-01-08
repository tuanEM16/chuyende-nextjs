import httpAxios from './httpAxios';

const PUBLIC_URL = 'menu';
const ADMIN_URL = 'admin/menu';

const MenuService = {

    index: () => httpAxios.get(PUBLIC_URL),
    show: (id) => httpAxios.get(`${PUBLIC_URL}/${id}`),


    store: (data) => httpAxios.post(ADMIN_URL, data),
    update: (id, data) => httpAxios.put(`${ADMIN_URL}/${id}`, data),
    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`)
};

export default MenuService;