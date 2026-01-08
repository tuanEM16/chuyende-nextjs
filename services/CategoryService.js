import httpAxios from './httpAxios';

const PUBLIC_URL = 'category';
const ADMIN_URL = 'admin/category';
const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/category/';
const IMAGE_FALLBACK = "https://placehold.co/100x100?text=Error"; 

const CategoryService = {

    index: () => httpAxios.get(PUBLIC_URL),
    show: (id) => httpAxios.get(`${PUBLIC_URL}/${id}`),


    store: (data) => httpAxios.post(`${ADMIN_URL}/store`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    

    update: (id, data) => httpAxios.post(`${ADMIN_URL}/update/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    

    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/destroy/${id}`),
    

    getImageUrl: (filename) => {
        if (!filename) return "https://placehold.co/100x100?text=No+Img";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    },

    handleImageError: (e) => {
        e.target.src = IMAGE_FALLBACK;
    }
};

export default CategoryService;