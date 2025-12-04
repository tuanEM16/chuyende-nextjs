import httpAxios from './httpAxios';

const CategoryService = {
    // Lấy danh sách
    index: async () => {
        return await httpAxios.get('category');
    },
    // Chi tiết
    show: async (id) => {
        return await httpAxios.get(`category/${id}`);
    },
    // Thêm mới (FormData)
    store: async (data) => {
        return await httpAxios.post('category', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    // Cập nhật (FormData + _method: PUT)
    update: async (id, data) => {
        return await httpAxios.post(`category/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    // Xóa
    destroy: async (id) => {
        return await httpAxios.delete(`category/${id}`);
    },
    // Lấy link ảnh
    getImageUrl: (filename) => {
        const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/category/';
        if (!filename) return "https://placehold.co/50x50?text=No+Img";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default CategoryService;