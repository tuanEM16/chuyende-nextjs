'use client';

import { useState, useEffect, use } from 'react'; // Thêm use để xử lý params
import Link from 'next/link';
import axios from 'axios';

export default function ProductDetailPage({ params: paramsPromise }) {
    // 1. Giải nén ID từ params bằng React.use()
    const params = use(paramsPromise);
    const id = params.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Cấu hình đường dẫn ảnh
    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/product/';

    // 2. Fetch dữ liệu từ API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/product/${id}`);
                if (res.data.success) {
                    setProduct(res.data.data);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết sản phẩm:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    // Helper hiển thị ảnh
    const getImageUrl = (filename) => {
        if (!filename) return "https://placehold.co/600x600?text=No+Image";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    };

    // 3. Xử lý trạng thái Loading
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-slate-500">Đang tải thông tin sản phẩm...</p>
            </div>
        );
    }

    // 4. Xử lý trạng thái Không tìm thấy (404)
    if (notFound || !product) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Không tìm thấy Sản phẩm</h1>
                <p className="text-lg text-slate-600">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <Link href="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                    &larr; Quay lại trang chủ
                </Link>
            </div>
        );
    }

    // Giả lập rating (vì DB chưa có)
    const rating = 5;

    // 5. Hiển thị giao diện chi tiết
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    
                    {/* Cột 1: Hình ảnh */}
                    <div className="bg-slate-100 p-8 flex items-center justify-center">
                        <img 
                            src={getImageUrl(product.thumbnail)} 
                            alt={product.name} 
                            className="w-full max-w-md h-auto rounded-lg shadow-lg object-cover transform hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = "https://placehold.co/600x600?text=Error"; }}
                        />
                    </div>

                    {/* Cột 2: Thông tin chi tiết */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div>
                            {/* Danh mục (Hiển thị ID tạm thời, hoặc tên nếu API đã join bảng) */}
                            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                                Danh mục ID: {product.category_id}
                            </span>
                            
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                                {product.name}
                            </h1>
                            
                            {/* Đánh giá */}
                            <div className="flex items-center text-yellow-500 mb-6">
                                {'★'.repeat(rating)}
                                {'☆'.repeat(5 - rating)}
                                <span className="ml-2 text-slate-400 text-sm font-medium">({rating} sao)</span>
                            </div>

                            {/* Giá */}
                            <p className="text-4xl font-bold text-indigo-600 mb-6">
                                {Number(product.price_buy).toLocaleString('vi-VN')}₫
                            </p>

                            {/* Mô tả ngắn */}
                            <div className="text-slate-600 mb-8 leading-relaxed prose prose-slate">
                                <p>{product.description || "Chưa có mô tả cho sản phẩm này."}</p>
                            </div>
                            
                            {/* Tình trạng tồn kho */}
                            <div className="flex items-center mb-8">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    product.qty > 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${product.qty > 0 ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                    {product.qty > 0 ? `Còn hàng (${product.qty})` : 'Hết hàng'}
                                </span>
                            </div>

                            {/* Nút Thêm vào Giỏ hàng */}
                            <div className="flex gap-4">
                                <button 
                                    disabled={product.qty <= 0}
                                    className={`flex-1 py-4 rounded-xl text-lg font-bold shadow-lg transition duration-300 transform active:scale-95 ${
                                        product.qty > 0 
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30' 
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                    }`}
                                    onClick={() => alert("Chức năng thêm vào giỏ hàng sẽ được cập nhật sau!")}
                                >
                                    {product.qty > 0 ? 'Thêm vào Giỏ hàng' : 'Tạm hết hàng'}
                                </button>
                                {/* Nút yêu thích (Optional) */}
                                <button className="p-4 rounded-xl border-2 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phần nội dung chi tiết (Content) */}
                <div className="border-t border-slate-100 p-8 lg:p-12">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Chi tiết sản phẩm</h2>
                    <div className="prose prose-indigo max-w-none text-slate-600">
                        {product.content ? (
                            <div dangerouslySetInnerHTML={{ __html: product.content }} />
                        ) : (
                            <p>Không có thông tin chi tiết.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}