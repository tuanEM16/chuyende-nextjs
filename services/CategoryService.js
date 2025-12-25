import httpAxios from './httpAxios';

const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/category/';
const IMAGE_FALLBACK = "https://placehold.co/100x100?text=Error"; 

const CategoryService = {
    index: async () => {
        return await httpAxios.get('category');
    },
    show: async (id) => {
        return await httpAxios.get(`category/${id}`);
    },
    store: async (data) => {
        return await httpAxios.post('category', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    update: async (id, data) => {
        return await httpAxios.post(`category/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    destroy: async (id) => {
        return await httpAxios.delete(`category/${id}`);
    },
    
    // --- 1. LOGIC LẤY ẢNH ---
    getImageUrl: (filename) => {
        if (!filename) return "https://placehold.co/100x100?text=No+Img";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    },

    // --- 2. LOGIC XỬ LÝ KHI ẢNH LỖI (Đưa vào đây) ---
    handleImageError: (e) => {
        e.target.src = IMAGE_FALLBACK;
    }
};

export default CategoryService;