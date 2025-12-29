'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductService from '@/services/ProductService';
import BannerService from '@/services/BannerService'; // Import thêm service Banner

// --- SUB-COMPONENTS ---

// 1. BANNER SLIDER COMPONENT
const BannerSlider = ({ banners }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Tự động chạy slide mỗi 5 giây
    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (banners.length === 0) return null;

    return (
        <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-slate-900 mb-12 group">
            {/* Các Slide */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                    {/* Hình nền */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear transform scale-100 group-hover:scale-105"
                        style={{ backgroundImage: `url('${BannerService.getImageUrl(banner.image)}')` }}
                    ></div>
                    
                    {/* Overlay tối để chữ dễ đọc */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Nội dung Banner */}
                    <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl animate-fade-in-up">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                                {banner.name}
                            </h2>
                            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto font-light drop-shadow-md">
                                {banner.description}
                            </p>
                            {banner.link && (
                                <Link 
                                    href={banner.link} 
                                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl"
                                >
                                    Khám Phá Ngay
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Nút điều hướng (Chỉ hiện nếu có > 1 slide) */}
            {banners.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                idx === currentIndex ? 'bg-indigo-500 w-8' : 'bg-white/50 hover:bg-white'
                            }`}
                        ></button>
                    ))}
                </div>
            )}
        </section>
    );
};

// 2. PRODUCT CARD COMPONENT (Giữ nguyên của bạn)
const ProductCard = ({ product }) => {
    const priceBuy = Number(product.price_buy);
    const priceSale = product.price_sale ? Number(product.price_sale) : null;
    const isSale = priceSale && priceSale < priceBuy;

    return (
        <div className="group bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="relative w-full pt-[75%] overflow-hidden bg-gray-100">
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">New</span>
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
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <Link href={`/product/${product.id}`} className="bg-white/90 text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white">
                        Xem Ngay
                    </Link>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-semibold">
                    {product.category?.name || 'Sản phẩm'}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors" title={product.name}>
                    {product.name}
                </h3>
                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        {isSale ? (
                            <>
                                <span className="block text-xl font-extrabold text-red-600">{priceSale.toLocaleString('vi-VN')}₫</span>
                                <span className="text-sm text-slate-400 line-through">{priceBuy.toLocaleString('vi-VN')}₫</span>
                            </>
                        ) : (
                            <span className="block text-xl font-extrabold text-slate-900">{priceBuy.toLocaleString('vi-VN')}₫</span>
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
    const [banners, setBanners] = useState([]); // State chứa danh sách banner
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                
                // Gọi song song 2 API: Banner và Sản phẩm mới
                const [bannerRes, productRes] = await Promise.all([
                    BannerService.index(),
                    ProductService.getNewProducts() // Hoặc ProductService.index() tuỳ API bạn
                ]);

                // 1. Xử lý Banner
                const bannerData = bannerRes.data?.data || bannerRes.data || [];
                // Chỉ lấy banner có vị trí là 'slideshow'
                const slideshowBanners = bannerData.filter(b => b.position === 'slideshow');
                setBanners(slideshowBanners);

                // 2. Xử lý Sản phẩm
                let productsArray = [];
                if (productRes.data && Array.isArray(productRes.data.data)) {
                    productsArray = productRes.data.data;
                } else if (productRes.data && productRes.data.data && Array.isArray(productRes.data.data.data)) {
                    productsArray = productRes.data.data.data;
                } else if (productRes.data && Array.isArray(productRes.data)) {
                    productsArray = productRes.data;
                }
                setNewProducts(productsArray.slice(0, 4));

            } catch (error) {
                console.error("Lỗi tải trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            
            {/* --- BANNER SLIDER --- */}
            {/* Nếu đang loading thì hiện khung xám, nếu có banner thì hiện slider, nếu không có thì fallback */}
            {loading ? (
                <div className="w-full h-[500px] bg-slate-200 animate-pulse mb-12"></div>
            ) : banners.length > 0 ? (
                <BannerSlider banners={banners} />
            ) : (
                // Fallback nếu chưa có banner nào trong DB
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
            )}

            {/* --- DANH SÁCH SẢN PHẨM --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Sản Phẩm Mới Về</h2>
                        <p className="text-slate-500 mt-1">Cập nhật xu hướng gạch ốp lát 2025</p>
                    </div>
                    <Link href="/product" className="hidden md:block text-indigo-600 font-semibold hover:text-indigo-800 transition">
                        Xem tất cả &rarr;
                    </Link>
                </div>

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

                <div className="mt-8 text-center md:hidden">
                    <Link href="/product" className="inline-block border border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-bold">
                        Xem tất cả sản phẩm
                    </Link>
                </div>
            </div>
        </div>
    );
} 