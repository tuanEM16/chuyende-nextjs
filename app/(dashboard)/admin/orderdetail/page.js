'use client';
import { useState, useEffect } from 'react';
import OrderDetailService from '@/services/OrderDetailService';

// Icon
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

export default function OrderDetailList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        OrderDetailService.index().then(res => {
            if(res.success) setItems(res.data || []);
        });
    }, []);

    const handleDelete = async (id) => {
        if(confirm('Xóa dòng chi tiết này? (Cảnh báo: Sẽ làm sai lệch tổng tiền đơn hàng)')) {
            await OrderDetailService.destroy(id);
            setItems(items.filter(i => i.id !== id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Chi tiết Sản phẩm đã bán</h1>

            <div className="bg-white rounded shadow overflow-hidden border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Đơn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá bán</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-indigo-600">
                                    #{item.order_id}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {item.product?.name || `Product ID: ${item.product_id}`}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {Number(item.price).toLocaleString()}đ
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                    x{item.qty}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                    {Number(item.amount).toLocaleString()}đ
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800" title="Xóa dòng này">
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}