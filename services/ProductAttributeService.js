import httpAxios from './httpAxios';
import ProductService from './ProductService';
import AttributeService from './AttributeService';

const ProductAttributeService = {
    index: async () => await httpAxios.get('productattribute'),
    
    store: async (data) => await httpAxios.post('productattribute', data),
    
    // --- THÊM MỚI ---
    show: async (id) => await httpAxios.get(`productattribute/${id}`),
    
    update: async (id, data) => await httpAxios.put(`productattribute/${id}`, data),
    // ----------------

    destroy: async (id) => await httpAxios.delete(`productattribute/${id}`),

    // Hàm lấy data nguồn cho trang Add/Edit
    getPrepareData: async () => {
        try {
            const [prodRes, attrRes] = await Promise.all([
                ProductService.index(),
                AttributeService.index()
            ]);
            return {
                success: true,
                products: prodRes.data?.data || prodRes.data || [],
                attributes: attrRes.data?.data || attrRes.data || []
            };
        } catch (error) {
            return { success: false, products: [], attributes: [] };
        }
    }
};

export default ProductAttributeService;