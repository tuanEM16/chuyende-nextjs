'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ProductService from '@/services/ProductService'; 

// ==========================================
// 1. SKELETON LOADING
// ==========================================
const ProductDetailSkeleton = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse bg-slate-50 min-h-screen">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-slate-200 h-[400px] lg:h-[600px] w-full"></div>
            <div className="p-8 lg:p-12 space-y-6">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-10 bg-slate-200 rounded w-3/4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                <div className="space-y-3 pt-4">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
            </div>
        </div>
    </div>
);

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function ProductDetailPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [activeImage, setActiveImage] = useState(null); // Chỉ lưu khi người dùng click chọn

    // --- 1. Fetch Data ---
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await ProductService.show(id);
                
                if (res && res.data && res.data.success) {
                    setProduct(res.data.data);
                    // Lưu ý: Không cần set activeImage ở đây nữa để tránh lỗi async
                } else {
                    setProduct(res.data || res);
                    if (!res.data) setNotFound(true);
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    // --- 2. Loading / Error UI ---
    if (loading) return <ProductDetailSkeleton />;
    if (notFound || !product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Không tìm thấy sản phẩm</h1>
            <Link href="/product" className="bg-indigo-600 text-white px-6 py-2 rounded-full">Quay lại</Link>
        </div>
    );

    // --- 3. LOGIC HIỂN THỊ ẢNH (QUAN TRỌNG) ---
    // Gom tất cả ảnh vào 1 mảng gallery
    const galleryImages = [];
    if (product.thumbnail) galleryImages.push(ProductService.getImageUrl(product.thumbnail));
    if (product.product_images && Array.isArray(product.product_images)) {
        product.product_images.forEach(img => galleryImages.push(ProductService.getImageUrl(img.image)));
    }

    // Logic chọn ảnh hiển thị: Nếu activeImage có thì dùng, không thì lấy ảnh đầu tiên trong gallery
    const displayImage = activeImage || (galleryImages.length > 0 ? galleryImages[0] : null);

    // --- 4. Logic Giá & Tồn kho ---
    const stockQty = Number(product.qty || 0);
    const isOutOfStock = stockQty <= 0;
    const priceOriginal = Number(product.price_buy || 0);
    const priceSaleRaw = product.price_sale;
    const priceSale = priceSaleRaw ? Number(priceSaleRaw) : null;
    const isSale = !!(priceSale && priceSale > 0);
    const discountPercent = isSale ? Math.round(((priceOriginal - priceSale) / priceOriginal) * 100) : 0;

    return (
        <div className="bg-slate-50 min-h-screen py-8 lg:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-slate-500 mb-6 overflow-hidden whitespace-nowrap">
                    <Link href="/" className="hover:text-indigo-600">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link href="/product" className="hover:text-indigo-600">Sản phẩm</Link>
                    <span className="mx-2">/</span>
                    <span className="text-slate-900 font-medium truncate">{product.name}</span>
                </nav>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        
                        {/* --- CỘT TRÁI: HÌNH ẢNH --- */}
                        <div className="bg-gray-100 p-6 lg:p-10 flex flex-col items-center">
                            
                            {/* ẢNH LỚN (ACTIVE) */}
                            <div className="relative w-full aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden mb-4 group cursor-zoom-in">
                                <img 
                                    src={displayImage || "https://placehold.co/600x600?text=No+Image"} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain mix-blend-multiply transform transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => { e.target.src = "https://placehold.co/600x600?text=Error"; }}
                                />

                                {/* Badge Sale */}
                                {isSale && !isOutOfStock && (
                                    <span className="absolute top-4 left-4 bg-red-600 text-white text-base font-bold px-3 py-1.5 rounded-lg shadow-md z-10 animate-pulse">
                                        -{discountPercent}%
                                    </span>
                                )}

                                {/* Badge Hết hàng */}
                                {isOutOfStock && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                                        <span className="bg-slate-800 text-white text-xl font-bold px-6 py-3 rounded-lg shadow-xl border-2 border-white uppercase tracking-widest">
                                            Hết hàng
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* LIST ẢNH NHỎ (GALLERY) */}
                            {galleryImages.length > 0 && (
                                <div className="grid grid-cols-5 gap-3 w-full">
                                    {galleryImages.map((imgUrl, index) => (
                                        <div 
                                            key={index}
                                            onClick={() => setActiveImage(imgUrl)}
                                            className={`
                                                cursor-pointer aspect-square rounded-lg border-2 overflow-hidden bg-white transition hover:opacity-100
                                                ${displayImage === imgUrl ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent opacity-60'}
                                            `}
                                        >
                                            <img src={imgUrl} className="w-full h-full object-cover" alt={`Thumb ${index}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- CỘT PHẢI: THÔNG TIN CHI TIẾT --- */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                            
                            {/* Danh mục */}
                            <div className="mb-4">
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {product.category?.name || 'Sản phẩm'}
                                </span>
                            </div>
                            
                            {/* Tên Sản phẩm */}
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                                {product.name}
                            </h1>
                            
                            {/* Giá & Trạng thái */}
                            <div className="mb-8 pb-8 border-b border-slate-100">
                                <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
                                    {isSale ? (
                                        <>
                                            <span className="text-4xl font-black text-red-600">
                                                {priceSale.toLocaleString('vi-VN')}₫
                                            </span>
                                            <div className="flex flex-col mb-1">
                                                <span className="text-lg text-slate-400 line-through decoration-2">
                                                    {priceOriginal.toLocaleString('vi-VN')}₫
                                                </span>
                                                <span className="text-xs text-red-500 font-medium">
                                                    Tiết kiệm: {(priceOriginal - priceSale).toLocaleString('vi-VN')}₫
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-black text-indigo-900">
                                            {priceOriginal.toLocaleString('vi-VN')}₫
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span className={`w-3 h-3 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                    <span className={isOutOfStock ? 'text-red-600' : 'text-green-700'}>
                                        {isOutOfStock ? 'Hết hàng' : `Còn hàng`}
                                    </span>
                                    {!isOutOfStock && <span className="text-slate-400 pl-2 border-l border-slate-300">Kho: {stockQty}</span>}
                                </div>
                            </div>

                            {/* Mô tả ngắn */}
                            <div className="prose prose-slate text-slate-600 mb-8">
                                <p>{product.description || "Mô tả đang được cập nhật..."}</p>
                            </div>

                            {/* Thuộc tính */}
                            {product.product_attributes && product.product_attributes.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {product.product_attributes.map((attr, idx) => (
                                        <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                                            <span className="text-slate-500 block text-xs uppercase mb-1">{attr.attribute?.name || 'Thuộc tính'}</span>
                                            <span className="font-bold text-slate-800">{attr.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Nút hành động */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                <button 
                                    disabled={isOutOfStock}
                                    className={`flex-1 py-4 px-6 rounded-xl text-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                                    ${isOutOfStock 
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30'
                                    }`}
                                    onClick={() => alert("Đã thêm vào giỏ hàng")}
                                >
                                    {isOutOfStock ? 'Tạm Hết Hàng' : 'Thêm Vào Giỏ'}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}