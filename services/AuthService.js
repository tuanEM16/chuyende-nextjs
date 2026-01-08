import httpAxios from './httpAxios';

const AuthService = {
    login: (email, password) => httpAxios.post('login', { email, password }),
    register: (data) => httpAxios.post('register', data),
    logout: () => httpAxios.post('logout'),
    getProfile: () => httpAxios.get('profile')
};

export default AuthService;