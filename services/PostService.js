import httpAxios from './httpAxios';

const PostService = {
    index: async () => {
        return await httpAxios.get('post');
    },
    show: async (id) => {
        return await httpAxios.get(`post/${id}`);
    },
    store: async (data) => {
        return await httpAxios.post('post', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    update: async (id, data) => {
        return await httpAxios.post(`post/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    destroy: async (id) => {
        return await httpAxios.delete(`post/${id}`);
    },
    getImageUrl: (filename) => {
        const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/post/';
        if (!filename) return "https://placehold.co/200x120?text=No+Img";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default PostService;