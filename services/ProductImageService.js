import httpAxios from './httpAxios';

const ProductImageService = {
    index: async () => await httpAxios.get('productimage'),
    store: async (data) => await httpAxios.post('productimage', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    destroy: async (id) => await httpAxios.delete(`productimage/${id}`),
    
    // Helper hiển thị ảnh
    getImageUrl: (filename) => {
        return filename ? `http://127.0.0.1:8000/images/product/${filename}` : "https://placehold.co/150x150?text=No+Image";
    }
};

export default ProductImageService;