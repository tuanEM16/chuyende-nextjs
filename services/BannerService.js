import httpAxios from './httpAxios';

const PUBLIC_URL = 'banner';
const ADMIN_URL = 'admin/banner';
const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/banner/';

const BannerService = {

    index: () => httpAxios.get(PUBLIC_URL),


    show: (id) => httpAxios.get(`${ADMIN_URL}/${id}`),
    
    store: (data) => httpAxios.post(ADMIN_URL, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    

    update: (id, data) => httpAxios.post(`${ADMIN_URL}/${id}?_method=PUT`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`),


    getImageUrl: (filename) => {
        if (!filename) return "https://placehold.co/800x300?text=No+Img";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default BannerService;