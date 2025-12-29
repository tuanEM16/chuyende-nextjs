'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ProductImageService from '@/services/ProductImageService';

// --- ICONS ---
const ArrowLeftIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const TrashIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

export default function ShowProductImagePage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;

    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await ProductImageService.show(id);
                const data = res.data && res.data.success ? res.data.data : (res.data || res);
                setImageData(data);
            } catch (error) {
                console.error("Lỗi tải chi tiết ảnh:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc muốn xóa hình ảnh này vĩnh viễn?')) {
            try {
                await ProductImageService.destroy(id);
                alert("Đã xóa thành công!");
                window.location.href = "/admin/productimage"; // Quay về danh sách
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-500 animate-pulse">Đang tải dữ liệu...</div>;
    
    if (!imageData) return (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl text-slate-700 mb-4 font-bold">Không tìm thấy hình ảnh</h2>
            <Link href="/admin/productimage" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                Quay lại danh sách
            </Link>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Chi tiết Hình ảnh</h1>
                <Link href="/admin/productimage" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon /> <span className="ml-2">Quay lại</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    
                    {/* CỘT TRÁI: HIỂN THỊ ẢNH */}
                    <div className="p-6 bg-slate-100 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
                        <div className="relative group w-full h-full min-h-[300px] flex items-center justify-center">
                            <img 
                                src={ProductImageService.getImageUrl(imageData.image)} 
                                alt={imageData.alt || "Product Image"}
                                className="max-w-full max-h-[500px] object-contain rounded shadow-sm hover:scale-105 transition-transform duration-300"
                                onError={(e) => e.target.src = "https://placehold.co/600x400?text=No+Image"}
                            />
                        </div>
                    </div>

                    {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
                    <div className="p-8 space-y-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                                    {imageData.product?.name || <span className="text-red-400 italic">Sản phẩm không tồn tại</span>}
                                </h2>
                                <p className="text-sm text-slate-500">Thuộc sản phẩm ID: #{imageData.product_id}</p>
                            </div>
                            
                            {/* Nút Xóa */}
                            <button 
                                onClick={handleDelete}
                                className="flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition"
                            >
                                <TrashIcon size={18} /> Xóa ảnh
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="border-b border-slate-100 pb-4">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ID Hình ảnh</label>
                                    <p className="text-slate-800 font-mono text-lg">#{imageData.id}</p>
                                </div>

                                <div className="border-b border-slate-100 pb-4">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tên file (Database)</label>
                                    <p className="text-indigo-600 font-mono break-all">{imageData.image}</p>
                                </div>

                                <div className="border-b border-slate-100 pb-4">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alt Text (SEO)</label>
                                    <p className="text-slate-800">
                                        {imageData.alt ? imageData.alt : <span className="text-slate-400 italic">Chưa có văn bản thay thế</span>}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tiêu đề (Title)</label>
                                    <p className="text-slate-800">
                                        {imageData.title ? imageData.title : <span className="text-slate-400 italic">Chưa có tiêu đề</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}