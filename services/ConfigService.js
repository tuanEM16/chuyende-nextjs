import httpAxios from './httpAxios';

const ConfigService = {

    index: () => httpAxios.get('config'),


    update: (data) => httpAxios.post('admin/config/update', data)
};

export default ConfigService;