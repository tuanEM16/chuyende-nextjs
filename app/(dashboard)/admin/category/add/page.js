'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CategoryService from '@/services/CategoryService';

// --- ICONS ---
const ArrowLeftIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const SaveIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);
const UploadIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);
// --- END ICONS ---

export default function AddCategoryPage() {
    const router = useRouter();
    
    // States Form
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState(0);
    const [sortOrder, setSortOrder] = useState(1);
    const [status, setStatus] = useState(1);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Data load từ API
    const [categories, setCategories] = useState([]);

    // 1. Load danh mục để chọn Parent ID
    useEffect(() => {
        (async () => {
            try {
                const res = await CategoryService.index();
                if (res.success) {
                    setCategories(res.data.data || []);
                }
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        })();
    }, []);

    // 2. Tạo slug tự động
    const generateSlug = (value) => {
        return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setSlug(generateSlug(value));
    };

    // 3. Xử lý chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // 4. Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        formData.append('description', description);
        formData.append('parent_id', parentId);
        formData.append('sort_order', sortOrder);
        formData.append('status', status);
        if (image) {
            formData.append('image', image);
        }

        try {
            await CategoryService.store(formData);
            alert('Thêm danh mục thành công!');
            router.push('/admin/category'); // Chuyển hướng về trang danh sách
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Thêm Danh mục</h1>
                <Link href="/admin/category" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cột trái: Thông tin chính */}
                <div className="md:col-span-2 space-y-6 bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tên danh mục <span className="text-red-500">*</span></label>
                        <input
                            type="text" required value={name} onChange={handleNameChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            placeholder="Ví dụ: Thời trang Nam"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
                        <input
                            type="text" required value={slug} onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả</label>
                        <textarea
                            rows="4" value={description} onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none"
                            placeholder="Mô tả ngắn..."
                        ></textarea>
                    </div>
                </div>

                {/* Cột phải: Cấu hình & Ảnh */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục cha</label>
                            <select 
                                value={parentId} 
                                onChange={(e) => setParentId(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none"
                            >
                                <option value="0">-- Không có (Danh mục gốc) --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Thứ tự sắp xếp</label>
                            <input
                                type="number" min="1" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none"
                            >
                                <option value="1">Xuất bản (Hiện)</option>
                                <option value="2">Nháp (Ẩn)</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadIcon className="text-slate-400 mb-2" />
                                        <p className="text-xs text-slate-500">Click để tải ảnh</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium shadow-md"
                    >
                        <SaveIcon />
                        <span>Lưu Danh mục</span>
                    </button>
                </div>
            </form>
        </div>
    );
}