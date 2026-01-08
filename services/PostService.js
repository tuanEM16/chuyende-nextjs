import httpAxios from './httpAxios';

const PUBLIC_URL = 'post';
const ADMIN_URL = 'admin/post';
const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/post/';

const PostService = {

    index: () => httpAxios.get(PUBLIC_URL),
    show: (id) => httpAxios.get(`${PUBLIC_URL}/${id}`),


    store: (data) => httpAxios.post(ADMIN_URL, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),


    update: (id, data) => httpAxios.post(`${ADMIN_URL}/${id}?_method=PUT`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`),


    getImageUrl: (filename) => {
        if (!filename) return "https://placehold.co/200x120?text=No+Img";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default PostService;