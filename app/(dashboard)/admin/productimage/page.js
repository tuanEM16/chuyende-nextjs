'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductImageService from '@/services/ProductImageService';

// Icons
const PlusIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

export default function ProductImageGallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        ProductImageService.index().then(res => {
            if(res.success) setImages(res.data || []);
        });
    }, []);

    const handleDelete = async (id) => {
        if(confirm('Xóa ảnh này?')) {
            await ProductImageService.destroy(id);
            setImages(images.filter(i => i.id !== id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Thư viện Ảnh Sản phẩm</h1>
                <Link href="/admin/productimage/add" className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow">
                    <PlusIcon /> <span>Thêm Ảnh</span>
                </Link>
            </div>

            {/* Grid hiển thị ảnh */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {images.map((item) => (
                    <div key={item.id} className="group relative bg-white rounded-xl shadow border border-slate-200 overflow-hidden hover:shadow-lg transition">
                        <div className="aspect-square bg-slate-100 relative">
                            <img 
                                src={ProductImageService.getImageUrl(item.image)} 
                                alt={item.alt || 'Product Image'} 
                                className="w-full h-full object-cover"
                            />
                            {/* Nút xóa hiện khi hover */}
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow hover:bg-red-600"
                                title="Xóa ảnh"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                        <div className="p-3">
                            <p className="text-sm font-semibold text-slate-800 truncate" title={item.product?.name}>
                                {item.product ? item.product.name : 'SP đã xóa'}
                            </p>
                            <p className="text-xs text-slate-500 truncate mt-1">
                                {item.title || 'Không có tiêu đề'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            {images.length === 0 && (
                <div className="text-center py-10 text-slate-500">Chưa có ảnh nào trong thư viện.</div>
            )}
        </div>
    );
}