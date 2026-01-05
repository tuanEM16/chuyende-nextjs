import httpAxios from './httpAxios';

const UserService = {
    // AUTH
    login: async (email, password) => {
        return await httpAxios.post('login', { email, password });
    },
    
    register: async (data) => {
        return await httpAxios.post('register', data);
    },

    logout: async () => {
        return await httpAxios.post('logout');
    },

    getProfile: async () => {
        return await httpAxios.get('profile');
    },
    /////////////
    index: async () => {
        return await httpAxios.get('user');
    },

    show: async (id) => {
        return await httpAxios.get(`user/${id}`);
    },

    store: async (data) => {
        return await httpAxios.post('user', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    update: async (id, data) => {
        return await httpAxios.post(`user/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    destroy: async (id) => {
        return await httpAxios.delete(`user/${id}`);
    },

    getImageUrl: (filename) => {
        const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/user/';
        if (!filename) return null; 
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default UserService;