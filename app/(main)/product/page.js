'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

// Helper component hiển thị từng thẻ sản phẩm
const ProductCard = ({ product }) => {
    // Cấu hình đường dẫn ảnh từ Laravel
    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/product/';

    // Xử lý hiển thị ảnh an toàn
    const getImageUrl = (filename) => {
        if (!filename) return "https://placehold.co/400x400?text=No+Image";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    };

    // Giả lập rating vì DB chưa có cột này (mặc định 5 sao)
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
                {/* Badge giảm giá nếu có (logic giả định) */}
                {/* <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-20%</span> */}
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 min-h-[3.5rem]" title={product.name}>
                    {product.name}
                </h3>
                
                <p className="text-indigo-600 font-bold my-2 text-xl">
                    {Number(product.price_buy).toLocaleString('vi-VN')}₫
                </p>
                
                <div className="flex items-center text-sm text-yellow-500 mb-4">
                    {'★'.repeat(Math.floor(rating))}
                    {'☆'.repeat(5 - Math.floor(rating))}
                    <span className="ml-2 text-slate-400 text-xs">({rating} sao)</span>
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

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Gọi API lấy danh sách sản phẩm (chỉ lấy những sản phẩm có status != 0)
                const res = await axios.get('http://127.0.0.1:8000/api/product');
                
                if (res.data.success) {
                    // Xử lý dữ liệu trả về từ Laravel (paginate hoặc get)
                    // Nếu dùng paginate(20) trong controller thì data nằm trong res.data.data.data
                    // Nếu dùng get() thì data nằm trong res.data.data
                    const dataSrc = res.data.data.data || res.data.data || [];
                    setProducts(dataSrc);
                }
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-8 border-b border-slate-200 pb-3">
                Tất cả Sản phẩm
            </h1>
            
            {loading ? (
                // Hiệu ứng Loading Skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                            <div className="h-48 bg-slate-200 rounded mb-4"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                            <div className="h-10 bg-slate-200 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center p-10 bg-white rounded-xl mt-8 shadow-sm">
                            <p className="text-xl text-slate-500">Hiện chưa có sản phẩm nào được hiển thị.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}