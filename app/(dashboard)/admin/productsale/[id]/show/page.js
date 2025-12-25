'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ProductSaleService from '@/services/ProductSaleService';
import ProductService from '@/services/ProductService';

// --- ICONS ---
const ArrowLeftIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const EditIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

export default function ShowSalePage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;

    const [sale, setSale] = useState(null);
    const [productName, setProductName] = useState('Đang tải...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await ProductSaleService.show(id);
                const data = res.data && res.data.success ? res.data.data : (res.data || res);
                setSale(data);

                if (data && data.product_id) {
                    try {
                        const prodRes = await ProductService.show(data.product_id);
                        const prodData = prodRes.data?.data || prodRes.data;
                        if (prodData) setProductName(prodData.name);
                    } catch (e) {
                        setProductName(`Sản phẩm #${data.product_id} (Không tìm thấy)`);
                    }
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết khuyến mãi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-center py-10 text-slate-500 animate-pulse">Đang tải dữ liệu...</div>;
    
    if (!sale) return (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl text-slate-700 mb-4 font-bold">Không tìm thấy khuyến mãi</h2>
            {/* SỬA LINK QUAY LẠI */}
            <Link href="/admin/productsale" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                Quay lại danh sách
            </Link>
        </div>
    );

    const now = new Date();
    const begin = new Date(sale.date_begin);
    const end = new Date(sale.date_end);
    let statusLabel;

    if (sale.status !== 1) {
        statusLabel = <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">Đã tắt</span>;
    } else if (now < begin) {
        statusLabel = <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Sắp diễn ra</span>;
    } else if (now >= begin && now <= end) {
        statusLabel = <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Đang diễn ra</span>;
    } else {
        statusLabel = <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">Đã kết thúc</span>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Chi tiết Khuyến mãi</h1>
                {/* SỬA LINK QUAY LẠI */}
                <Link href="/admin/productsale" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon /> <span className="ml-2">Quay lại</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{sale.name}</h2>
                    {/* SỬA LINK EDIT */}
                    <Link 
                        href={`/admin/productsale/${id}/edit`} 
                        className="flex items-center space-x-2 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200 transition"
                    >
                        <EditIcon size={16} /> <span>Chỉnh sửa</span>
                    </Link>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sản phẩm áp dụng</label>
                            <p className="text-lg font-medium text-indigo-700">{productName}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Giá khuyến mãi</label>
                            <p className="text-2xl font-bold text-red-600">
                                {Number(sale.price_sale).toLocaleString('vi-VN')} ₫
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Trạng thái</label>
                            <div className="mt-1">{statusLabel}</div>
                        </div>
                    </div>

                    <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Thời gian bắt đầu</label>
                            <p className="text-slate-800 font-mono">
                                {new Date(sale.date_begin).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Thời gian kết thúc</label>
                            <p className="text-slate-800 font-mono">
                                {new Date(sale.date_end).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-200 mt-4">
                            <p className="text-xs text-slate-500 italic">
                                Ngày tạo: {new Date(sale.created_at).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}