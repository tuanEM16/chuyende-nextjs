import httpAxios from './httpAxios';

const ContactService = {
    index: async () => {
        return await httpAxios.get('contact');
    },
    show: async (id) => {
        return await httpAxios.get(`contact/${id}`);
    },
    // Thường dùng ở trang Frontend (Khách gửi liên hệ)
    store: async (data) => {
        return await httpAxios.post('contact', data);
    },
    // Admin trả lời hoặc cập nhật trạng thái
    update: async (id, data) => {
        return await httpAxios.put(`contact/${id}`, data);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`contact/${id}`);
    }
};

export default ContactService;