import httpAxios from './httpAxios';

const ProductService = {
    // 1. Lấy danh sách sản phẩm
    index: async () => {
        return await httpAxios.get('product');
    },

    // 2. Lấy chi tiết 1 sản phẩm
    show: async (id) => {
        return await httpAxios.get(`product/${id}`);
    },

    // 3. Thêm sản phẩm (có upload ảnh)
    store: async (data) => {
        return await httpAxios.post('product', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // 4. Cập nhật sản phẩm (có upload ảnh -> dùng POST + _method: PUT)
    update: async (id, data) => {
        return await httpAxios.post(`product/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    destroy: async (id) => {
        return await httpAxios.delete(`product/${id}`);
    },
    getImageUrl: (filename) => {
        const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/product/';
        if (!filename) return "https://placehold.co/150?text=No+Image";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default ProductService;