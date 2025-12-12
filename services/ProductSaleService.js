import httpAxios from './httpAxios';

const ProductSaleService = {
    // Lấy danh sách khuyến mãi
    index: async () => {
        return await httpAxios.get('productsale');
    },

    // Lấy chi tiết 1 khuyến mãi (để sửa)
    show: async (id) => {
        return await httpAxios.get(`productsale/${id}`);
    },

    // Thêm mới
    store: async (data) => {
        return await httpAxios.post('productsale', data);
    },

    // Cập nhật
    update: async (id, data) => {
        return await httpAxios.put(`productsale/${id}`, data);
    },

    // Xóa
    destroy: async (id) => {
        return await httpAxios.delete(`productsale/${id}`);
    },
    
    // Helper: Lấy sản phẩm để chọn (nếu cần gọi riêng, nhưng thường dùng ProductService)
    getProducts: async () => {
        return await httpAxios.get('product'); 
    }
};

export default ProductSaleService;