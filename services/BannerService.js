import httpAxios from './httpAxios';

const BannerService = {
    index: async () => {
        return await httpAxios.get('banner');
    },
    show: async (id) => {
        return await httpAxios.get(`banner/${id}`);
    },
    store: async (data) => {
        return await httpAxios.post('banner', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    update: async (id, data) => {
        return await httpAxios.post(`banner/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    destroy: async (id) => {
        return await httpAxios.delete(`banner/${id}`);
    },
    getImageUrl: (filename) => {
        const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/banner/';
        if (!filename) return "https://placehold.co/800x300?text=No+Img";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    }
};

export default BannerService;