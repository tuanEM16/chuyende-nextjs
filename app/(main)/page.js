'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductService from '@/services/ProductService'; // Đảm bảo đường dẫn import đúng

// --- SUB-COMPONENTS ---

const ProductCard = ({ product }) => {
    // Ép kiểu số để tính toán an toàn
    const priceBuy = Number(product.price_buy);
    const priceSale = product.price_sale ? Number(product.price_sale) : null;
    
    // Kiểm tra có đang sale không (Có giá sale và giá sale nhỏ hơn giá gốc)
    const isSale = priceSale && priceSale < priceBuy;

    return (
        <div className="group bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full">
            {/* Khung ảnh */}
            <div className="relative w-full pt-[75%] overflow-hidden bg-gray-100">
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {/* Badge New */}
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        New
                    </span>
                    {/* Badge Sale (Nếu có) */}
                    {isSale && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                            -{Math.round(((priceBuy - priceSale) / priceBuy) * 100)}%
                        </span>
                    )}
                </div>
                
                <img 
                    src={ProductService.getImageUrl(product.thumbnail)} 
                    alt={product.name} 
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                />
                
                {/* Overlay Action */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <Link 
                        href={`/product/${product.id}`}
                        className="bg-white/90 text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
                    >
                        Xem Ngay
                    </Link>
                </div>
            </div>

            {/* Nội dung */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-semibold">
                    {product.category?.name || 'Sản phẩm'}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors" title={product.name}>
                    {product.name}
                </h3>
                
                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        {/* Logic hiển thị giá: Nếu có sale thì hiện giá sale màu đỏ, giá gốc gạch ngang */}
                        {isSale ? (
                            <>
                                <span className="block text-xl font-extrabold text-red-600">
                                    {priceSale.toLocaleString('vi-VN')}₫
                                </span>
                                <span className="text-sm text-slate-400 line-through">
                                    {priceBuy.toLocaleString('vi-VN')}₫
                                </span>
                            </>
                        ) : (
                            // Không sale thì hiện giá gốc màu đen
                            <span className="block text-xl font-extrabold text-slate-900">
                                {priceBuy.toLocaleString('vi-VN')}₫
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse h-[380px] border border-slate-100">
        <div className="w-full h-48 bg-slate-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
        <div className="h-6 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-6 bg-slate-200 rounded w-2/3 mb-6"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2 mt-auto"></div>
    </div>
);

// --- MAIN PAGE ---

export default function HomePage() {
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                const res = await ProductService.getNewProducts();

                // Debug: Xem cấu trúc thực tế trả về (bấm F12 mở tab Console để xem)
                console.log("Dữ liệu API trả về:", res);

                // Xử lý logic lấy mảng sản phẩm
                let productsArray = [];

                // Trường hợp 1: Dùng httpAxios trả về data trực tiếp
                if (res.data && Array.isArray(res.data.data)) {
                    productsArray = res.data.data;
                }
                // Trường hợp 2: Trả về full object axios
                else if (res.data && res.data.data && Array.isArray(res.data.data.data)) {
                    productsArray = res.data.data.data;
                }
                // Trường hợp 3: Fallback (nếu cấu trúc khác)
                else if (res.data && Array.isArray(res.data)) {
                    productsArray = res.data;
                }

                setNewProducts(productsArray.slice(0, 4)); // Lấy 4 sản phẩm

            } catch (error) {
                console.error("Lỗi load trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Banner Hero */}
            <section className="relative bg-slate-900 text-white py-24 px-4 overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
                <div className="relative max-w-7xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        TILE <span className="text-indigo-500">STORE</span> VIETNAM
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto font-light">
                        Không gian sống đẳng cấp bắt đầu từ những chi tiết nhỏ nhất.
                    </p>
                    <Link href="/product" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl">
                        Khám Phá Ngay
                    </Link>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tiêu đề section */}
                <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Sản Phẩm Mới Về</h2>
                        <p className="text-slate-500 mt-1">Cập nhật xu hướng gạch ốp lát 2025</p>
                    </div>
                    <Link href="/product" className="hidden md:block text-indigo-600 font-semibold hover:text-indigo-800 transition">
                        Xem tất cả &rarr;
                    </Link>
                </div>

                {/* Grid Sản phẩm */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newProducts.length > 0 ? (
                            newProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl shadow-sm">
                                Hiện chưa có sản phẩm nào mới.
                            </div>
                        )}
                    </div>
                )}

                {/* Nút xem tất cả cho Mobile */}
                <div className="mt-8 text-center md:hidden">
                    <Link href="/product" className="inline-block border border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-bold">
                        Xem tất cả sản phẩm
                    </Link>
                </div>
            </div>
        </div>
    );
}