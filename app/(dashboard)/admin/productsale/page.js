'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductSaleService from '@/services/ProductSaleService';
import ProductService from '@/services/ProductService';

// --- ICONS ---
const PlusIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const TrashIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const EyeIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-1 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EditIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

export default function ProductSaleList() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ProductSaleService.index().then(res => {
            if (res.data && (res.data.success || Array.isArray(res.data.data) || Array.isArray(res.data))) {
                setSales(res.data.data || res.data || []);
            }
            setLoading(false);
        });
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Xóa chương trình này?')) {
            try {
                await ProductSaleService.destroy(id);
                setSales(sales.filter(s => s.id !== id));
                alert("Đã xóa thành công");
            } catch (e) {
                alert("Xóa thất bại");
            }
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    // Helper trạng thái
    const getStatus = (start, end, status) => {
        if (status !== 1) return <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">Tạm ngưng</span>;

        const now = new Date();
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (now < startDate) return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Sắp diễn ra</span>;
        if (now > endDate) return <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold">Đã kết thúc</span>;
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold animate-pulse">Đang chạy</span>;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Khuyến mãi</h1>
                <Link href="/admin/productsale/add" className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow font-medium transition">
                    <PlusIcon /> <span>Tạo mới</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Sản phẩm</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Chương trình</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Giá khuyến mãi</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Thời gian</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr><td colSpan="6" className="py-8 text-center text-slate-500 animate-pulse">Đang tải dữ liệu...</td></tr>
                            ) : sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-slate-50 transition duration-150">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {sale.product && (
                                                <div className="h-12 w-12 rounded border mr-3 bg-slate-100 overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={ProductService.getImageUrl(sale.product.thumbnail)}
                                                        className="h-full w-full object-cover"
                                                        alt={sale.product.name}
                                                        onError={(e) => e.target.src = "https://placehold.co/50x50?text=Error"}
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-slate-900 text-sm line-clamp-1 max-w-[200px]" title={sale.product?.name}>
                                                    {sale.product?.name || <span className="text-red-400 italic">Sản phẩm đã xóa</span>}
                                                </div>
                                                <div className="text-xs text-slate-400 line-through">
                                                    Gốc: {sale.product ? Number(sale.product.price_buy).toLocaleString() : 0}đ
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                        {sale.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-red-600 font-bold text-lg">{Number(sale.price_sale).toLocaleString()}đ</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-600 space-y-1">
                                        <div><span className="font-semibold">BĐ:</span> {formatDate(sale.date_begin)}</div>
                                        <div><span className="font-semibold">KT:</span> {formatDate(sale.date_end)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getStatus(sale.date_begin, sale.date_end, sale.status)}
                                    </td>

                                    {/* --- CỘT HÀNH ĐỘNG --- */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center space-x-2">
                                            {/* Xem chi tiết */}
                                            <Link
                                                href={`/admin/productsale/${sale.id}/show`}
                                                className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded transition hover:bg-blue-100"
                                                title="Xem chi tiết"
                                            >
                                                <EyeIcon />
                                            </Link>

                                            {/* Sửa */}
                                            <Link
                                                href={`/admin/productsale/${sale.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-2 rounded transition hover:bg-indigo-100"
                                                title="Chỉnh sửa"
                                            >
                                                <EditIcon />
                                            </Link>

                                            {/* Xóa */}
                                            <button
                                                onClick={() => handleDelete(sale.id)}
                                                className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded transition hover:bg-red-100"
                                                title="Xóa"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && sales.length === 0 && (
                                <tr><td colSpan="6" className="py-10 text-center text-slate-500">Chưa có chương trình khuyến mãi nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}