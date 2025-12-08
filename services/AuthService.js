import httpAxios from './httpAxios';

const AuthService = {
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
        return await httpAxios.get('profile'); // Cần route API tương ứng ở Laravel
    }
};

export default AuthService;