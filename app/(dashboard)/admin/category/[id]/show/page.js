'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import CategoryService from '@/services/CategoryService';

// --- ICONS ---
const ArrowLeftIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const EditIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
// --- END ICONS ---

export default function ShowCategoryPage({ params: paramsPromise }) {
    // 1. Unwrap params
    const params = use(paramsPromise);
    const id = params.id;

    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. Fetch Data
    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await CategoryService.show(id);
                // Xử lý response linh hoạt (laravel resource hoặc json thường)
                const data = res.data && res.data.success ? res.data.data : (res.data || res);
                setCategory(data);
            } catch (error) {
                console.error("Lỗi tải chi tiết danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-center py-10 text-slate-500 animate-pulse">Đang tải dữ liệu...</div>;
    
    if (!category) return (
        <div className="text-center py-10">
            <h2 className="text-xl text-slate-700 mb-4">Không tìm thấy danh mục</h2>
            <Link href="/admin/category" className="text-indigo-600 hover:underline">Quay lại danh sách</Link>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Chi tiết Danh mục</h1>
                <Link href="/admin/category" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                {/* Card Header: Tên & Nút Sửa */}
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Ảnh thumbnail nhỏ ở header */}
                        <img 
                            src={CategoryService.getImageUrl(category.image)} 
                            alt={category.name}
                            className="w-12 h-12 rounded-lg object-cover border bg-white"
                            onError={CategoryService.handleImageError}
                        />
                        <h2 className="text-xl font-bold text-slate-800">{category.name}</h2>
                    </div>
                    <Link 
                        href={`/admin/category/${id}/edit`} 
                        className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium bg-white px-4 py-2 rounded-lg border border-indigo-200 shadow-sm hover:shadow transition"
                    >
                        <EditIcon size={16} />
                        <span>Chỉnh sửa</span>
                    </Link>
                </div>
                
                <div className="p-8 space-y-8">
                    {/* Phần 1: Thông tin cơ bản */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ID</label>
                            <p className="text-slate-800 font-mono text-lg">#{category.id}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Slug</label>
                            <p className="text-slate-800 font-mono bg-slate-100 inline-block px-2 py-1 rounded text-sm border">
                                {category.slug}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Danh mục cha</label>
                            <p className="text-slate-800 font-medium">
                                {category.parent_id === 0 ? (
                                    <span className="text-slate-400 italic">Là danh mục gốc</span>
                                ) : (
                                    `ID: ${category.parent_id}`
                                )}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Thứ tự</label>
                            <p className="text-slate-800 font-medium">{category.sort_order}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Trạng thái</label>
                            <div>
                                {category.status === 1 ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Hiển thị
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Đang ẩn
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ngày tạo</label>
                            <p className="text-slate-800 text-sm">
                                {new Date(category.created_at).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>

                    {/* Phần 2: Hình ảnh lớn */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hình ảnh chi tiết</label>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block">
                            <img 
                                src={CategoryService.getImageUrl(category.image)} 
                                alt={category.name}
                                className="max-h-64 rounded-lg object-contain"
                                onError={CategoryService.handleImageError}
                            />
                        </div>
                    </div>

                    {/* Phần 3: Mô tả */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mô tả</label>
                        <div className="bg-slate-50 p-6 rounded-xl text-slate-700 leading-relaxed border border-slate-100">
                            {category.description ? category.description : <span className="italic text-slate-400">Không có mô tả.</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}