import httpAxios from './httpAxios';

const ADMIN_URL = 'admin/contact';

const ContactService = {

    store: (data) => httpAxios.post('contact/store', data),


    index: () => httpAxios.get(ADMIN_URL),
    show: (id) => httpAxios.get(`${ADMIN_URL}/${id}`),
    

    reply: (id, data) => httpAxios.post(`${ADMIN_URL}/reply/${id}`, data),
    
    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`)
};

export default ContactService;