'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ProductService from '@/services/ProductService'; 
import { useCart } from '../../../context/CartContext'; 

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

export default function ProductDetailPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;

    // --- Sử dụng Cart Context ---
    const { addToCart } = useCart(); // <--- Lấy hàm addToCart

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    
    // --- State quản lý số lượng mua ---
    const [quantity, setQuantity] = useState(1); // <--- Mặc định là 1

    // ... (Giữ nguyên useEffect fetchProduct) ...
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await ProductService.show(id);
                
                if (res && res.data && res.data.success) {
                    setProduct(res.data.data);
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

    // ... (Giữ nguyên Loading/Error UI) ...
    if (loading) return <ProductDetailSkeleton />;
    if (notFound || !product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Không tìm thấy sản phẩm</h1>
            <Link href="/product" className="bg-indigo-600 text-white px-6 py-2 rounded-full">Quay lại</Link>
        </div>
    );

    // ... (Giữ nguyên logic hiển thị ảnh) ...
    const galleryImages = [];
    if (product.thumbnail) galleryImages.push(ProductService.getImageUrl(product.thumbnail));
    if (product.product_images && Array.isArray(product.product_images)) {
        product.product_images.forEach(img => galleryImages.push(ProductService.getImageUrl(img.image)));
    }
    const displayImage = activeImage || (galleryImages.length > 0 ? galleryImages[0] : null);

    // --- Logic Giá & Tồn kho ---
    const stockQty = Number(product.qty || 0);
    const isOutOfStock = stockQty <= 0;
    const priceOriginal = Number(product.price_buy || 0);
    const priceSaleRaw = product.price_sale;
    const priceSale = priceSaleRaw ? Number(priceSaleRaw) : null;
    const isSale = !!(priceSale && priceSale > 0);
    
    // Xác định giá bán cuối cùng để thêm vào giỏ
    const finalPrice = isSale ? priceSale : priceOriginal;
    
    const discountPercent = isSale ? Math.round(((priceOriginal - priceSale) / priceOriginal) * 100) : 0;

    // --- HÀM XỬ LÝ THÊM VÀO GIỎ HÀNG ---
    const handleAddToCart = () => {
        if (isOutOfStock) {
            alert("Sản phẩm đã hết hàng!");
            return;
        }

        // Tạo object sản phẩm chuẩn hóa để lưu vào giỏ
        const itemToAdd = {
            id: product.id,
            name: product.name,
            price: finalPrice, // Quan trọng: Lưu giá thực tế đang bán
            thumbnail: product.thumbnail,
            slug: product.slug,
            // Bạn có thể thêm các thuộc tính khác nếu cần (màu sắc, kích thước...)
        };

        // Gọi hàm từ Context
        addToCart(itemToAdd, quantity);
        
        // Thông báo cho người dùng (có thể dùng Toast notification đẹp hơn alert)
        alert(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
    };

    return (
        <div className="bg-slate-50 min-h-screen py-8 lg:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ... (Giữ nguyên Breadcrumb) ... */}
                <nav className="flex items-center text-sm text-slate-500 mb-6 overflow-hidden whitespace-nowrap">
                    <Link href="/" className="hover:text-indigo-600">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link href="/product" className="hover:text-indigo-600">Sản phẩm</Link>
                    <span className="mx-2">/</span>
                    <span className="text-slate-900 font-medium truncate">{product.name}</span>
                </nav>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        
                        {/* --- CỘT TRÁI: HÌNH ẢNH (Giữ nguyên) --- */}
                        <div className="bg-gray-100 p-6 lg:p-10 flex flex-col items-center">
                            {/* ... (Code hiển thị ảnh giữ nguyên như cũ) ... */}
                            <div className="relative w-full aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden mb-4 group cursor-zoom-in">
                                <img 
                                    src={displayImage || "https://placehold.co/600x600?text=No+Image"} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain mix-blend-multiply transform transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => { e.target.src = "https://placehold.co/600x600?text=Error"; }}
                                />
                                {isSale && !isOutOfStock && (
                                    <span className="absolute top-4 left-4 bg-red-600 text-white text-base font-bold px-3 py-1.5 rounded-lg shadow-md z-10 animate-pulse">
                                        -{discountPercent}%
                                    </span>
                                )}
                                {isOutOfStock && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                                        <span className="bg-slate-800 text-white text-xl font-bold px-6 py-3 rounded-lg shadow-xl border-2 border-white uppercase tracking-widest">
                                            Hết hàng
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* ... (List ảnh nhỏ giữ nguyên) ... */}
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
                            
                            {/* Giá & Trạng thái (Giữ nguyên) */}
                            <div className="mb-6 pb-6 border-b border-slate-100">
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

                            {/* Mô tả ngắn & Thuộc tính (Giữ nguyên) */}
                            {/* ... */}

                            {/* --- PHẦN CHỌN SỐ LƯỢNG (MỚI) --- */}
                            {!isOutOfStock && (
                                <div className="mb-6">
                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Số lượng:</label>
                                    <div className="flex items-center border border-slate-300 w-max rounded-lg overflow-hidden">
                                        <button 
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="px-4 py-3 hover:bg-slate-100 text-slate-600 font-bold transition border-r border-slate-200"
                                            type="button"
                                        >-</button>
                                        <input 
                                            type="number" 
                                            className="w-16 text-center py-2 outline-none font-bold text-slate-800 bg-white"
                                            value={quantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val) && val >= 1) setQuantity(val);
                                            }}
                                            min="1"
                                        />
                                        <button 
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="px-4 py-3 hover:bg-slate-100 text-slate-600 font-bold transition border-l border-slate-200"
                                            type="button"
                                        >+</button>
                                    </div>
                                </div>
                            )}

                            {/* Nút hành động */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                <button 
                                    disabled={isOutOfStock}
                                    onClick={handleAddToCart} // <--- GỌI HÀM NÀY KHI CLICK
                                    className={`flex-1 py-4 px-6 rounded-xl text-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                                    ${isOutOfStock 
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30'
                                    }`}
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