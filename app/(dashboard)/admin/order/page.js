'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OrderService from '@/services/OrderService';

// Icons
const EyeIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await OrderService.index();
                if (res.success) {
                    setOrders(res.data.data || res.data || []); 
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusLabel = (status) => {
        switch(status) {
            case 1: return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">Mới</span>;
            case 2: return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">Đang giao</span>;
            case 3: return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">Hoàn thành</span>;
            case 4: return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">Đã hủy</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Khác</span>;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Quản lý Đơn hàng</h1>
            <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Mã đơn</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Khách hàng</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Ngày đặt</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Tổng tiền</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-6 text-slate-500">Đang tải...</td></tr>
                        ) : orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm font-mono text-indigo-600">#{order.id}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-900">{order.name}</div>
                                    <div className="text-xs text-slate-500">{order.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                    {OrderService.calculateTotal(order.orderdetails).toLocaleString('vi-VN')} đ
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {getStatusLabel(order.status)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Link href={`/admin/order/${order.id}`} className="text-indigo-600 hover:text-indigo-900 flex justify-center items-center gap-1">
                                        <EyeIcon /> <span>Xem</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}