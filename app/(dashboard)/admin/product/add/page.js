'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductService from '@/services/ProductService';
import CategoryService from '@/services/CategoryService';

// --- ICONS ---
const SaveIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const UploadIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
// --- END ICONS ---

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // State chứa danh sách danh mục lấy từ API
    const [categories, setCategories] = useState([]); 

    // Form khớp với ProductController
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',       
        stock: '0',      
        description: '', 
        status: 1
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // 1. Gọi API thật để lấy danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Gọi qua Service
                const res = await CategoryService.index();
                
                // Debug xem API trả về gì (F12 -> Console)
                console.log("API Category Response:", res);

                // Xử lý dữ liệu trả về theo đúng cấu trúc Controller bạn đưa
                // Controller trả về: { success: true, data: [...] }
                if (res.data && res.data.success) {
                    setCategories(res.data.data);
                } 
                else if (Array.isArray(res.data)) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error('Lỗi tải danh mục:', error);
                alert('Không lấy được danh mục. Kiểm tra API hoặc Database.');
            }
        };
        fetchCategories();
    }, []);

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
            
            // Map dữ liệu sang đúng tên biến trong ProductController
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price_buy', formData.price); // Controller dùng price_buy
            data.append('description', formData.description); 
            data.append('content', formData.description); 
            data.append('status', formData.status);
            
            if(formData.stock) data.append('qty', formData.stock); 

            if (imageFile) {
                data.append('thumbnail', imageFile); 
            }

            await ProductService.store(data);

            alert('Thêm sản phẩm thành công!');
            router.push('/admin/product');

        } catch (error) {
            console.error('Lỗi API:', error);
            const msg = error.response?.data?.message || 'Lỗi server';
            alert('Lỗi: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Thêm Sản phẩm</h1>
                <Link href="/admin/product" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* CỘT TRÁI */}
                <div className="md:col-span-2 space-y-6 bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                        <input 
                            type="text" name="name" required 
                            value={formData.name} onChange={handleChange} 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                            placeholder="Nhập tên sản phẩm..." 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                            <input 
                                type="number" name="price" required 
                                value={formData.price} onChange={handleChange} 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                                placeholder="0" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tồn kho</label>
                            <input 
                                type="number" name="stock" 
                                value={formData.stock} onChange={handleChange} 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                                placeholder="0" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả chi tiết</label>
                        <textarea 
                            name="description" rows="6" 
                            value={formData.description} onChange={handleChange} 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                            placeholder="Mô tả chi tiết về sản phẩm..."
                        ></textarea>
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-4">
                        {/* Danh mục - Lấy từ API thật */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
                            <select
                                name="category_id" required
                                value={formData.category_id} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                ) : (
                                    <option disabled>Không có danh mục nào (Kiểm tra DB)</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                            <select
                                name="status"
                                value={formData.status} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                <option value="1">Xuất bản (Hiện)</option>
                                <option value="2">Nháp (Ẩn)</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh</label>
                        <div className="flex flex-col items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition relative overflow-hidden">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadIcon className="text-slate-400 mb-2" />
                                        <p className="text-xs text-slate-500">Click để tải ảnh</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className={`w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? <span>Đang xử lý...</span> : <><SaveIcon /><span>Lưu sản phẩm</span></>}
                    </button>
                </div>
            </form>
        </div>
    );
}