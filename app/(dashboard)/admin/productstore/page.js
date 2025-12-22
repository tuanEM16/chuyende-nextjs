'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ProductStoreService from '@/services/ProductStoreService';
import ProductService from '@/services/ProductService';

// --- ICONS ĐÃ SỬA LỖI --
const PlusIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
// Sửa lỗi ở dòng này (bỏ </path> dư thừa)
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const EditIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

export default function InventoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await ProductStoreService.index();
            if (res.success) setHistory(res.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(confirm('Bạn có chắc muốn xóa phiếu nhập này?')) {
            try {
                await ProductStoreService.destroy(id);
                setHistory(prev => prev.filter(item => item.id !== id));
            } catch (error) {
                alert('Xóa thất bại');
            }
        }
    };

    const filteredHistory = history.filter(item => 
        item.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Quản lý Lịch sử Nhập kho</h1>
                <Link 
                    href="/admin/productstore/add"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-md transition"
                >
                    <PlusIcon /> Nhập hàng mới
                </Link>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3 top-2.5 text-slate-400"><SearchIcon /></span>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm phiếu nhập..." 
                        className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:border-indigo-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Sản phẩm</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Giá vốn</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Số lượng</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Thành tiền</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {loading ? (
                            <tr><td colSpan="5" className="p-10 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
                        ) : filteredHistory.length > 0 ? filteredHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={ProductService.getImageUrl(item.product?.thumbnail)} className="w-10 h-10 rounded object-cover border" />
                                    <div>
                                        <div className="font-medium text-slate-700">{item.product?.name}</div>
                                        <div className="text-xs text-slate-400">Mã nhập: #{item.id}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-medium">{Number(item.price_root).toLocaleString()}đ</td>
                                <td className="px-6 py-4 text-center font-bold text-blue-600">+{item.qty}</td>
                                <td className="px-6 py-4 text-right font-bold">{(item.price_root * item.qty).toLocaleString()}đ</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <Link href={`/admin/productstore/${item.id}/show`}className="text-blue-500 hover:bg-blue-50 p-2 rounded" title="Xem chi tiết"><EyeIcon /></Link>
                                        <Link href={`/admin/productstore/${item.id}/edit`} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded" title="Sửa"><EditIcon /></Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded" title="Xóa"><TrashIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="p-10 text-center text-slate-400 italic">Chưa có dữ liệu nhập kho.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}