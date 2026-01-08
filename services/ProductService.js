import httpAxios from './httpAxios';

const PUBLIC_URL = 'product';
const ADMIN_URL = 'admin/product';
const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/product/';

const ProductService = {
    getNewProducts: (limit = 10) => httpAxios.get(`${PUBLIC_URL}/new?limit=${limit}`),
    index: (params) => httpAxios.get(PUBLIC_URL, { params }),
    show: (id) => httpAxios.get(`${PUBLIC_URL}/${id}`),
    store: (data) => httpAxios.post(`${ADMIN_URL}/store`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => httpAxios.post(`${ADMIN_URL}/update/${id}?_method=PUT`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/destroy/${id}`),
    getImageUrl: (filename) => {
        if (!filename) return "https://placehold.co/400x400?text=No+Image";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default ProductService;