import httpAxios from './httpAxios';

const ADMIN_URL = 'admin/productimage';
const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/product/';

const ProductImageService = {

    index: () => httpAxios.get(ADMIN_URL),

    show: (id) => httpAxios.get(`${ADMIN_URL}/${id}`),

    store: (data) => httpAxios.post(ADMIN_URL, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),


    update: (id, data) => httpAxios.post(`${ADMIN_URL}/${id}?_method=PUT`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`),


    getImageUrl: (filename) => {
        if (!filename) return "https://placehold.co/150x150?text=No+Img";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default ProductImageService;