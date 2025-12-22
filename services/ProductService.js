import httpAxios from './httpAxios';

// Đường dẫn gốc chứa ảnh từ Laravel
// Lưu ý: Nếu Laravel chạy port 8000 thì để 8000, nếu port khác thì sửa lại
const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/product/';

const ProductService = {
    // 1. Lấy danh sách sản phẩm mới nhất (Hàm bị thiếu gây lỗi đây nè)
    getNewProducts: async (limit = 10) => {
        return await httpAxios.get(`product/new?limit=${limit}`);
    },

    // 2. Lấy danh sách tất cả sản phẩm
    index: async (params) => {
        return await httpAxios.get('product', { params });
    },

    // 3. Lấy chi tiết 1 sản phẩm
    show: async (id) => {
        return await httpAxios.get(`product/${id}`);
    },

    // 4. Lấy sản phẩm liên quan
    getRelated: async (id, limit = 4) => {
        return await httpAxios.get(`product/related/${id}?limit=${limit}`);
    },

    // 5. Thêm sản phẩm
    store: async (data) => {
        
        return await httpAxios.post('product', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // 6. Cập nhật sản phẩm
    update: async (id, data) => {
        return await httpAxios.post(`product/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // 7. Xóa sản phẩm
    destroy: async (id) => {
        return await httpAxios.delete(`product/${id}`);
    },

    // 8. Helper: Lấy URL ảnh
    getImageUrl: (filename) => {
        if (!filename) return "https://placehold.co/400x400?text=No+Image";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default ProductService;