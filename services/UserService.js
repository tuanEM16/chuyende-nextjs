import httpAxios from './httpAxios';

/* ================= BASE URL ================= */
const ADMIN_URL = 'admin/user';
const IMAGE_BASE_URL = 'http://127.0.0.1:8000/uploads/avatars/';

/* ================= SERVICE ================= */
const UserService = {

    /* ========= AUTH (USER THƯỜNG - PUBLIC) ========= */
    login: (email, password) => httpAxios.post('login', { email, password }),
    register: (data) => httpAxios.post('register', data),
    logout: () => httpAxios.post('logout'),
    getProfile: () => httpAxios.get('profile'),
    changePassword: (payload) => httpAxios.post("user/change-password", payload),
    updateProfile: (formData) =>
        httpAxios.post('profile/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    getImageUrl: (filename) => {
        if (!filename) return "https://placehold.co/100x100?text=No+Avatar";
        if (filename.startsWith('http')) return filename;
        if (filename.startsWith('/')) return 'http://127.0.0.1:8000' + filename; // ✅
        return IMAGE_BASE_URL + filename;
    },

    /* ========= ADMIN – USER CRUD ========= */
    index: () => httpAxios.get(ADMIN_URL),
    show: (id) => httpAxios.get(`${ADMIN_URL}/${id}`),
    store: (data) => httpAxios.post(ADMIN_URL, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, data) => httpAxios.post(`${ADMIN_URL}/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`),
    getImageUrl: (filename) => {
        if (!filename) return "https://placehold.co/100x100?text=No+Avatar";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default UserService;