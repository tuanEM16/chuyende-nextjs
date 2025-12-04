import httpAxios from './httpAxios';

const TopicService = {
    index: async () => {
        return await httpAxios.get('topic');
    },
    show: async (id) => {
        return await httpAxios.get(`topic/${id}`);
    },
    store: async (data) => {
        return await httpAxios.post('topic', data);
    },
    update: async (id, data) => {
        return await httpAxios.put(`topic/${id}`, data);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`topic/${id}`);
    }
};

export default TopicService;