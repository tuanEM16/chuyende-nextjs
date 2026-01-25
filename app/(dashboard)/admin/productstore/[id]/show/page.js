'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ProductStoreService from '@/services/ProductStoreService';
import ProductService from '@/services/ProductService';


const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const CalendarIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const DollarIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const UserIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

const ClockIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

export default function ShowInventoryPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await ProductStoreService.show(id);
                if (res.success || res.data) {
                    setStore(res.data.data || res.data);
                }
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>;
    if (!store) return <div className="p-10 text-center text-red-500">Không tìm thấy phiếu nhập kho.</div>;

    const totalAmount = Number(store.price_root) * Number(store.qty);


    const formatDate = (dateStr) => {
        if (!dateStr) return '---';
        return new Date(dateStr).toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <Link href="/admin/productstore" className="p-2 bg-white border rounded-lg hover:bg-slate-50 text-slate-500 transition">
                    <ArrowLeftIcon />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Chi tiết Phiếu Nhập #{store.id}</h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <CalendarIcon size={14} /> 
                        <span>Ngày nhập: {formatDate(store.created_at)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Cột Trái: Thông tin Sản phẩm */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-500 text-xs uppercase mb-4 tracking-wider">Sản phẩm nhập</h3>
                        {store.product ? (
                            <div className="text-center">
                                <div className="w-full aspect-square rounded-lg overflow-hidden border border-slate-100 mb-4 bg-slate-50 flex items-center justify-center">
                                    <img 
                                        src={ProductService.getImageUrl(store.product.thumbnail)} 
                                        className="w-full h-full object-contain" 
                                        alt={store.product.name} 
                                    />
                                </div>
                                <h2 className="font-bold text-slate-800 text-lg mb-1">{store.product.name}</h2>
                                <p className="text-sm text-slate-500 mb-3">Danh mục: {store.product.category?.name || '---'}</p>
                                <p className="text-xs text-slate-400">ID Sản phẩm: {store.product_id}</p>
                            </div>
                        ) : (
                            <div className="text-red-500 italic text-center py-4">Sản phẩm gốc đã bị xóa khỏi hệ thống.</div>
                        )}
                    </div>
                </div>

                {/* Cột Phải: Chi tiết giao dịch nhập */}
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
                        <h3 className="font-bold text-slate-500 text-xs uppercase mb-6 tracking-wider">Thông tin giao dịch</h3>
                        
                        <div className="space-y-6">
                            {/* Dòng 1: Giá vốn & Số lượng */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Giá nhập (Vốn)</p>
                                    <p className="text-xl font-bold text-slate-800">
                                        {Number(store.price_root).toLocaleString()} ₫
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">Đơn giá / sản phẩm</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-xs text-green-600 font-bold uppercase mb-1">Số lượng nhập</p>
                                    <p className="text-xl font-bold text-slate-800">
                                        +{store.qty}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">Đơn vị sản phẩm</p>
                                </div>
                            </div>

                            {/* Dòng 2: Thành tiền */}
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white rounded-full text-slate-600 shadow-sm">
                                        <DollarIcon />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-700">TỔNG TIỀN NHẬP</span>
                                        <span className="text-xs text-slate-400">Giá vốn x Số lượng</span>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-indigo-600">
                                    {totalAmount.toLocaleString()} ₫
                                </span>
                            </div>

                            {/* Dòng 3: Meta data (ĐÃ CẬP NHẬT THÊM NGÀY GIỜ) */}
                            <div className="border-t border-slate-100 pt-4 mt-2">
                                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                                    
                                    {/* Người thực hiện */}
                                    <div className="flex items-start gap-2">
                                        <UserIcon className="text-slate-400 mt-0.5" size={16} />
                                        <div>
                                            <span className="block text-slate-400 text-xs font-bold uppercase">Người thực hiện</span>
                                            <span className="font-medium text-slate-700">Admin (ID: {store.created_by})</span>
                                        </div>
                                    </div>

                                    {/* Trạng thái */}
                                    <div className="text-right">
                                        <span className="block text-slate-400 text-xs font-bold uppercase">Trạng thái</span>
                                        {store.status === 1 ? (
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">Đã nhập kho</span>
                                        ) : (
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-bold">Lưu nháp</span>
                                        )}
                                    </div>

                                    {/* --- MỚI: CẬP NHẬT LẦN CUỐI --- */}
                                    {store.updated_at && store.updated_at !== store.created_at && (
                                        <div className="col-span-2 flex items-center gap-2 pt-2 border-t border-dashed border-slate-100 mt-2">
                                            <ClockIcon className="text-orange-400" size={16} />
                                            <div>
                                                <span className="text-xs text-slate-400 font-bold uppercase mr-2">Cập nhật lần cuối:</span>
                                                <span className="text-sm font-medium text-orange-600">
                                                    {formatDate(store.updated_at)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}