'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductService from '@/services/ProductService';
import CategoryService from '@/services/CategoryService';

const SaveIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const UploadIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;

export default function EditProductPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        stock: '0',
        description: '',
        status: 1
    });

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Gọi song song 2 API
                const [catRes, prodRes] = await Promise.all([
                    CategoryService.index(),
                    ProductService.show(id)
                ]);

                // 1. Xử lý Danh mục (Theo cách trang List của bạn)
                if (catRes.success) {
                    setCategories(catRes.data.data || catRes.data || []);
                }

                // 2. Xử lý Sản phẩm (Sửa lại logic kiểm tra success)
                if (prodRes.success) {
                    // Dữ liệu sản phẩm nằm trong prodRes.data
                    const product = prodRes.data; 
                    
                    setFormData({
                        name: product.name,
                        category_id: product.category_id,
                        price: product.price_buy,
                        stock: product.qty || 0,
                        description: product.description || '',
                        status: product.status
                    });

                    if (product.thumbnail) {
                        setCurrentImageUrl(ProductService.getImageUrl(product.thumbnail));
                    }
                } else {
                    console.error("API trả về lỗi hoặc không tìm thấy");
                }

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price_buy', formData.price);
            data.append('qty', formData.stock);
            data.append('description', formData.description);
            data.append('content', formData.description);
            data.append('status', formData.status);
            data.append('_method', 'PUT'); // Bắt buộc cho update

            if (imageFile) {
                data.append('thumbnail', imageFile);
            }

            const res = await ProductService.update(id, data);
            
            if (res.success) {
                alert('Cập nhật thành công!');
                router.push('/admin/product');
            } else {
                alert('Cập nhật thất bại: ' + res.message);
            }

        } catch (error) {
            console.error(error);
            alert('Lỗi hệ thống!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Cập nhật Sản phẩm</h1>
                <Link href="/admin/product" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon /> <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6 bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tên sản phẩm</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Giá bán</label>
                            <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tồn kho</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả</label>
                        <textarea name="description" rows="6" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none"></textarea>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục</label>
                            <select name="category_id" required value={formData.category_id} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                                <option value="1">Xuất bản</option>
                                <option value="2">Nháp</option>
                            </select>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 text-center">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh</label>
                        {previewUrl ? <img src={previewUrl} className="h-40 mx-auto object-contain mb-2" /> : currentImageUrl ? <img src={currentImageUrl} className="h-40 mx-auto object-contain mb-2 border" /> : <div className="h-40 flex items-center justify-center bg-gray-50 border-2 border-dashed rounded mb-2"><UploadIcon /></div>}
                        <input type="file" onChange={handleImageChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium shadow-md">
                        {loading ? 'Đang lưu...' : <><SaveIcon /><span>Cập nhật</span></>}
                    </button>
                </div>
            </form>
        </div>
    );
}