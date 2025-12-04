'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

// Component hiển thị thẻ sản phẩm (Tái sử dụng logic hiển thị ảnh)
const ProductCard = ({ product }) => {
    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/product/';

    const getImageUrl = (filename) => {
        if (!filename) return "https://placehold.co/400x400?text=No+Image";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    };

    // Giả lập rating (vì DB chưa có)
    const rating = 5;

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col h-full">
            <div className="relative w-full h-48 overflow-hidden">
                <img 
                    src={getImageUrl(product.thumbnail)} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Error"; }}
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-slate-800 truncate" title={product.name}>
                    {product.name}
                </h3>
                <p className="text-indigo-600 font-bold my-2 text-2xl">
                    {Number(product.price_buy).toLocaleString('vi-VN')}₫
                </p>
                <div className="flex items-center text-sm text-yellow-500 mb-4">
                    {'★'.repeat(rating)}
                    {'☆'.repeat(5 - rating)}
                    <span className="ml-2 text-slate-500 text-xs">({rating})</span>
                </div>
                
                <div className="mt-auto">
                    <Link 
                        href={`/product/${product.id}`} 
                        className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 font-medium"
                    >
                        Xem chi tiết
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Gọi API lấy sản phẩm
                const res = await axios.get('http://127.0.0.1:8000/api/product');
                
                if (res.data.success) {
                    const allProducts = res.data.data.data || res.data.data || [];
                    
                    // Lấy 3 sản phẩm mới nhất làm "Sản phẩm nổi bật"
                    // (Bạn có thể tùy chỉnh logic này, ví dụ lọc theo cột is_featured nếu có)
                    setFeaturedProducts(allProducts.slice(0, 3));
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Banner / Hero Section */}
            <section className="text-center mb-12 bg-indigo-50 p-10 rounded-2xl shadow-inner">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                    Chào mừng đến với TileStore
                </h1>
                <p className="text-xl text-slate-600 mb-6">
                    Chuyên cung cấp gạch ốp lát và thiết bị vệ sinh cao cấp.
                </p>
                <Link 
                    href="/products" // Link đến trang danh sách sản phẩm
                    className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                >
                    Khám phá Sản phẩm
                </Link>
            </section>

            {/* Sản phẩm nổi bật */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b border-slate-200 pb-2">
                    Sản phẩm mới nổi bật
                </h2>
                
                {loading ? (
                    // Skeleton Loading cho đẹp
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse h-96">
                                <div className="h-48 bg-slate-200 rounded mb-4"></div>
                                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <p className="text-slate-500 col-span-3 text-center">Chưa có sản phẩm nào.</p>
                        )}
                    </div>
                )}
            </section>

            {/* Bài viết mới nhất (Mockup - sau này có API Post thì thay vào) */}
            <section>
                <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">
                    Bài viết mới nhất
                </h2>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 text-center">
                    <p className="text-slate-500 mb-4">Kiến thức xây dựng, mẹo chọn gạch và xu hướng thiết kế mới nhất.</p>
                    <Link href="/post" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                        Xem tất cả bài viết 
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}