import httpAxios from './httpAxios';
import ProductService from './ProductService';
import AttributeService from './AttributeService';

const ADMIN_URL = 'admin/productattribute';

const ProductAttributeService = {
    index: () => httpAxios.get(ADMIN_URL),
    show: (id) => httpAxios.get(`${ADMIN_URL}/${id}`),
    store: (data) => httpAxios.post(ADMIN_URL, data),
    update: (id, data) => httpAxios.put(`${ADMIN_URL}/${id}`, data),
    destroy: (id) => httpAxios.delete(`${ADMIN_URL}/${id}`),


    getPrepareData: async () => {
        try {
            const [prodRes, attrRes] = await Promise.all([
                ProductService.index(),   // Đảm bảo ProductService đã trỏ đúng API cần thiết
                AttributeService.index()  // Đảm bảo AttributeService đã trỏ đúng API cần thiết
            ]);
            
            return {
                success: true,
                products: prodRes.data?.data || prodRes.data || [],
                attributes: attrRes.data?.data || attrRes.data || []
            };
        } catch (error) {
            console.error("Lỗi lấy dữ liệu chuẩn bị:", error);
            return { success: false, products: [], attributes: [] };
        }
    }
};

export default ProductAttributeService;