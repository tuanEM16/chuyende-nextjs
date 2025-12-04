import httpAxios from './httpAxios';

const ConfigService = {
    // Lấy cấu hình web (thường chỉ có 1 dòng active)
    getConfig: async () => {
        return await httpAxios.get('config'); 
    },
    
    // Cập nhật cấu hình
    update: async (id, data) => {
        return await httpAxios.put(`config/${id}`, data);
    }
};

export default ConfigService;