import httpAxios from './httpAxios';

const ConfigService = {
    getConfig: async () => {
        return await httpAxios.get('config');
    },
    updateConfig: async (data) => {
        return await httpAxios.post('config/update', data);
    }
};

export default ConfigService;