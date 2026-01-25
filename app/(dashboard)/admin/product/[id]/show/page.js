'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ProductService from '@/services/ProductService';


const EditIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

export default function ProductDetailPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await ProductService.show(id);
                const data = res.data && res.data.data ? res.data.data : (res.data || res);

                if (data) {
                    setProduct(data);
                    if (data.thumbnail) setActiveImage(ProductService.getImageUrl(data.thumbnail));
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>;
    if (!product) return <div className="p-10 text-center text-red-500">Không tìm thấy sản phẩm.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/product" className="p-2 bg-white border rounded-lg hover:bg-slate-50 text-slate-500 transition">
                        <ArrowLeftIcon />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Chi tiết sản phẩm</h1>
                        <p className="text-sm text-slate-500">ID: #{product.id} — Ngày tạo: {new Date(product.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>
                <Link 
                    href={`/admin/product/${product.id}/edit`} 
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow"
                >
                    <EditIcon size={18} /> <span>Chỉnh sửa</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- CỘT TRÁI: HÌNH ẢNH --- */}
                <div className="space-y-4">
                    <div className="bg-white p-2 rounded-xl shadow border border-slate-200">
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center relative">
                            {activeImage ? (
                                <img src={activeImage} alt={product.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-slate-400">Không có ảnh</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {product.thumbnail && (
                            <div 
                                onClick={() => setActiveImage(ProductService.getImageUrl(product.thumbnail))}
                                className={`cursor-pointer border-2 rounded-lg overflow-hidden h-16 bg-white transition hover:opacity-100 ${activeImage === ProductService.getImageUrl(product.thumbnail) ? 'border-indigo-600' : 'border-slate-200 opacity-70'}`}
                            >
                                <img src={ProductService.getImageUrl(product.thumbnail)} className="w-full h-full object-cover" alt="Thumbnail" />
                            </div>
                        )}
                        {product.product_images && product.product_images.map((img) => {
                            const imgUrl = ProductService.getImageUrl(img.image);
                            return (
                                <div 
                                    key={img.id}
                                    onClick={() => setActiveImage(imgUrl)}
                                    className={`cursor-pointer border-2 rounded-lg overflow-hidden h-16 bg-white transition hover:opacity-100 ${activeImage === imgUrl ? 'border-indigo-600' : 'border-slate-200 opacity-70'}`}
                                >
                                    <img src={imgUrl} className="w-full h-full object-cover" alt={img.alt || 'Gallery'} />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* --- CỘT PHẢI: THÔNG TIN --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">{product.name}</h2>
                        
                        <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                            <div>
                                <span className="block text-slate-500 mb-1">Danh mục</span>
                                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded inline-block">
                                    {product.category ? product.category.name : 'Chưa cập nhật'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-slate-500 mb-1">Giá bán</span>
                                <span className="text-2xl font-bold text-indigo-600">
                                    {Number(product.price_buy).toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                            <div>
                                <span className="block text-slate-500 mb-1">Tồn kho</span>
                                {/* HIỂN THỊ TỒN KHO TẠI ĐÂY */}
                                <span className="text-lg font-bold text-slate-800">{product.qty || 0}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 mb-1">Trạng thái</span>
                                {product.status === 1 ? <span className="text-green-600 font-bold">Đang bán</span> : <span className="text-red-600 font-bold">Ngừng bán</span>}
                            </div>
                        </div>
                    </div>

                    {product.product_attributes && product.product_attributes.length > 0 && (
                        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
                            <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">Thuộc tính</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.product_attributes.map((attr, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                                        <span className="text-slate-500 font-medium">
                                            {attr.attribute ? attr.attribute.name : `Thuộc tính #${attr.attribute_id}`}
                                        </span>
                                        <span className="font-bold text-slate-800">{attr.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
                        <h3 className="font-bold text-slate-700 mb-3 border-b pb-2">Mô tả</h3>
                        <div className="prose max-w-none text-slate-600 whitespace-pre-line text-sm">
                            {product.description || "Chưa có mô tả."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}