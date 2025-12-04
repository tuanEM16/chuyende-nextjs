import httpAxios from './httpAxios';

const AuthService = {
    // Đăng nhập
    login: async (email, password) => {
        return await httpAxios.post('login', { email, password });
    },

    // Đăng ký
    register: async (data) => {
        return await httpAxios.post('register', data);
    },

    // Đăng xuất (Gọi API để hủy token trên server nếu cần)
    logout: async () => {
        return await httpAxios.post('logout');
    },

    // Lấy thông tin user đang đăng nhập (Profile)
    getProfile: async () => {
        return await httpAxios.get('profile'); // Cần route API tương ứng ở Laravel
    }
};

export default AuthService;