'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductService from '@/services/ProductService'; 

// ==========================================
// 1. COMPONENT THẺ SẢN PHẨM
// ==========================================
const ProductCard = ({ product }) => {
    // A. XỬ LÝ TỒN KHO
    const stockQty = product.qty || product.total_qty || 0; 
    const isOutOfStock = stockQty <= 0;

    // B. XỬ LÝ GIÁ (Backend đã tính sẵn price_sale)
    const priceOriginal = Number(product.price_buy);
    const priceSale = product.price_sale ? Number(product.price_sale) : null;
    
    // Có sale khi backend trả về giá sale > 0
    const isSale = !!priceSale; 

    // Tính % giảm
    const discountPercent = isSale 
        ? Math.round(((priceOriginal - priceSale) / priceOriginal) * 100) 
        : 0;

    return (
        <div className={`group bg-white rounded-xl shadow-md transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full 
            ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-xl hover:-translate-y-1'}`}>
            
            {/* ẢNH */}
            <div className="relative w-full pt-[75%] overflow-hidden bg-gray-50">
                {/* --- SỬ DỤNG HÀM TỪ SERVICE TẠI ĐÂY --- */}
                <img 
                    src={ProductService.getImageUrl(product.thumbnail)} 
                    alt={product.name} 
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Error"; }}
                />
                
                {/* Badge Hết hàng */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                        <span className="border-2 border-white text-white px-4 py-1 font-bold tracking-widest text-sm uppercase">
                            Hết hàng
                        </span>
                    </div>
                )}

                {/* Badge Sale */}
                {!isOutOfStock && isSale && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded shadow-sm z-10">
                        -{discountPercent}%
                    </span>
                )}

                {/* Overlay Button */}
                {!isOutOfStock && (
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                         <Link 
                            href={`/product/${product.id}`}
                            className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
                        >
                            Xem Chi Tiết
                        </Link>
                    </div>
                )}
            </div>

            {/* THÔNG TIN */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-slate-400 mb-1 uppercase font-semibold">
                    {product.category?.name || 'Sản phẩm'}
                </div>
                
                <h3 className="text-base font-bold text-slate-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 transition-colors" title={product.name}>
                    {product.name}
                </h3>
                
                <div className="mt-auto pt-3 border-t border-slate-50">
                    {isSale ? (
                        <div className="flex flex-col">
                            <span className="text-lg font-extrabold text-red-600">
                                {priceSale.toLocaleString('vi-VN')}₫
                            </span>
                            <span className="text-sm text-slate-400 line-through">
                                {priceOriginal.toLocaleString('vi-VN')}₫
                            </span>
                        </div>
                    ) : (
                        <span className="text-lg font-extrabold text-slate-900">
                            {priceOriginal.toLocaleString('vi-VN')}₫
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 2. SKELETON LOADING
// ==========================================
const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse h-[360px] border border-slate-100">
        <div className="w-full h-40 bg-slate-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
        <div className="h-6 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-6 bg-slate-200 rounded w-2/3 mb-6"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2 mt-auto"></div>
    </div>
);

// ==========================================
// 3. MAIN PAGE
// ==========================================
export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Gọi API
                const res = await ProductService.index(); 
                
                let dataSrc = [];
                // Xử lý data trả về tùy theo format của Laravel (Paginate hay Collection)
                if (res.data && Array.isArray(res.data.data)) {
                    dataSrc = res.data.data; 
                } else if (res.data && Array.isArray(res.data)) {
                    dataSrc = res.data;
                } else if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
                    dataSrc = res.data.data.data;
                }

                setProducts(dataSrc);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-extrabold text-slate-900">
                        Tất Cả Sản Phẩm
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
                                <p className="text-xl font-medium text-slate-500">Chưa có sản phẩm nào.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}