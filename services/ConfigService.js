import httpAxios from './httpAxios';

const PUBLIC_URL = 'config';
const ADMIN_URL = 'admin/config';

const ConfigService = {
  // GET /config
  getConfig: () => httpAxios.get(PUBLIC_URL),

  // POST /admin/config/update
  updateConfig: (data) =>
    httpAxios.post(`${ADMIN_URL}/update`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // (tuỳ chọn) alias cho đồng bộ code khác
  index: () => httpAxios.get(PUBLIC_URL),
  update: (data) =>
    httpAxios.post(`${ADMIN_URL}/update`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default ConfigService;
