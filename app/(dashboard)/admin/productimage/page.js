'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // <--- Import thêm useRouter
import ProductImageService from '@/services/ProductImageService';

// --- ICONS ---
const PlusIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const EyeIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-1 12z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EditIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

export default function ProductImageGallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // <--- Khởi tạo router

    useEffect(() => {
        ProductImageService.index().then(res => {
            if (res.data && (res.data.success || Array.isArray(res.data.data) || Array.isArray(res.data))) {
                setImages(res.data.data || res.data || []);
            }
            setLoading(false);
        });
    }, []);

    const handleDelete = async (id, e) => {
        e.preventDefault();
        e.stopPropagation(); // Ngăn chặn click lan ra ngoài div cha

        if (confirm('Bạn có chắc muốn xóa ảnh này vĩnh viễn?')) {
            try {
                await ProductImageService.destroy(id);
                setImages(images.filter(i => i.id !== id));
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    // Hàm chuyển trang khi click vào card
    const handleCardClick = (id) => {
        router.push(`/admin/productimage/${id}/show`);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Thư viện Ảnh Sản phẩm</h1>
                <Link href="/admin/productimage/add" className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow transition">
                    <PlusIcon /> <span>Thêm Ảnh Mới</span>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500 animate-pulse">Đang tải dữ liệu...</div>
            ) : (
                <>
                    {/* Grid hiển thị ảnh */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {images.map((item) => (
                            // ĐỔI TỪ LINK THÀNH DIV
                            <div
                                key={item.id}
                                onClick={() => handleCardClick(item.id)}
                                className="group relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition block h-full cursor-pointer"
                            >

                                {/* Khung ảnh */}
                                <div className="aspect-square bg-slate-50 relative overflow-hidden">
                                    <img
                                        src={ProductImageService.getImageUrl(item.image)}
                                        alt={item.alt || 'Product Image'}
                                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-500"
                                        onError={(e) => e.target.src = "https://placehold.co/400x400?text=No+Image"}
                                    />

                                    {/* Overlay Actions (Hover) */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">

                                        {/* Nút Xem Chi Tiết (Chỉ là visual, click vào div cha đã chuyển trang rồi) */}
                                        <div className="bg-white/20 text-white p-2 rounded-full hover:bg-white hover:text-blue-600 transition backdrop-blur-sm" title="Xem chi tiết">
                                            <EyeIcon />
                                        </div>

                                        {/* Nút Sửa (Edit) - VẪN GIỮ LINK NHƯNG DÙNG stopPropagation */}
                                        <Link
                                            href={`/admin/productimage/${item.id}/edit`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-white/20 text-white p-2 rounded-full hover:bg-white hover:text-indigo-600 transition backdrop-blur-sm"
                                            title="Sửa ảnh & SEO"
                                        >
                                            <EditIcon />
                                        </Link>

                                        {/* Nút Xóa */}
                                        <button
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className="bg-white/20 text-white p-2 rounded-full hover:bg-red-500 hover:text-white transition backdrop-blur-sm"
                                            title="Xóa ảnh"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>

                                {/* Thông tin */}
                                <div className="p-3">
                                    <p className="text-xs font-bold text-indigo-600 mb-1">ID: {item.id}</p>
                                    <p className="text-sm font-semibold text-slate-800 truncate" title={item.product?.name}>
                                        {item.product ? item.product.name : <span className="text-red-400 italic">SP đã xóa</span>}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate mt-1" title={item.title}>
                                        {item.title || 'Chưa có tiêu đề'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {images.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500 mb-4">Chưa có hình ảnh nào trong thư viện.</p>
                            <Link href="/admin/productimage/add" className="text-indigo-600 font-bold hover:underline">
                                Thêm ảnh ngay
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}