'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OrderService from '@/services/OrderService';

import { Eye, Loader2, Search, Trash2 } from 'lucide-react';

export default function OrderPage() {
    const [orders, setOrders] = useState([]); 
    const [filteredOrders, setFilteredOrders] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    

    const [deletingId, setDeletingId] = useState(null);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await OrderService.index({ limit: 100 });
                if (res.data && res.data.success) {
                    const list = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.data || []);
                    setOrders(list);
                    setFilteredOrders(list);
                }
            } catch (error) {
                console.error("Lỗi tải đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);


    useEffect(() => {
        if (!searchTerm) {
            setFilteredOrders(orders);
            return;
        }
        const lowerTerm = searchTerm.toLowerCase();
        const results = orders.filter(order => 
            order.id.toString().includes(lowerTerm) || 
            order.name?.toLowerCase().includes(lowerTerm) ||
            order.phone?.includes(lowerTerm) ||
            order.email?.toLowerCase().includes(lowerTerm)
        );
        setFilteredOrders(results);
    }, [searchTerm, orders]);


    const handleStatusChange = async (id, newStatus) => {
        try {
            setUpdatingId(id); 
            const statusValue = parseInt(newStatus);
            const res = await OrderService.updateStatus(id, statusValue);

            if (res.data && res.data.success) {
                const updatedList = orders.map(order => 
                    order.id === id ? { ...order, status: statusValue } : order
                );
                setOrders(updatedList);
            }
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Cập nhật thất bại.");
        } finally {
            setUpdatingId(null); 
        }
    };


    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.")) {
            return;
        }

        try {
            setDeletingId(id);

            const res = await OrderService.destroy(id);

            if (res.data && res.data.success) {

                const newOrders = orders.filter(order => order.id !== id);
                setOrders(newOrders);

                setFilteredOrders(prev => prev.filter(order => order.id !== id));
                
                alert("Đã xóa đơn hàng thành công!");
            } else {
                alert(res.data.message || "Không thể xóa đơn hàng.");
            }
        } catch (error) {
            console.error("Lỗi xóa đơn hàng:", error);
            alert("Lỗi kết nối đến server.");
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
            case 3: return 'bg-green-100 text-green-800 border-green-200';
            case 4: return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header và Search giữ nguyên */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quản lý Đơn hàng</h1>
                    <p className="text-sm text-slate-500">Tổng số: {orders.length} đơn hàng</p>
                </div>
                
                <div className="relative w-full sm:w-72">
                    <input 
                        type="text" 
                        placeholder="Tìm Mã, Tên, SĐT..." 
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4 text-left">Mã đơn</th>
                                <th className="px-6 py-4 text-left">Khách hàng</th>
                                <th className="px-6 py-4 text-left">Ngày đặt</th>
                                <th className="px-6 py-4 text-right">Tổng tiền</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600 font-bold">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{order.name}</div>
                                            <div className="text-xs text-slate-500">{order.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(order.created_at).toLocaleDateString('vi-VN', {
                                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 text-right">
                                            {OrderService.calculateTotal(order.orderdetails).toLocaleString('vi-VN')}₫
                                        </td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="relative inline-block w-36">
                                                {updatingId === order.id ? (
                                                    <div className="flex items-center justify-center gap-2 text-indigo-600 text-xs font-medium py-1">
                                                        <Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...
                                                    </div>
                                                ) : (
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className={`block w-full text-xs font-bold py-1.5 pl-2 pr-6 rounded border-0 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-pointer ${getStatusColor(order.status)}`}
                                                    >
                                                        <option value="1">Mới</option>
                                                        <option value="2">Đang giao</option>
                                                        <option value="3">Hoàn thành</option>
                                                        <option value="4">Đã hủy</option>
                                                    </select>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Nút Xem */}
                                                <Link 
                                                    href={`/admin/orderdetail?orderId=${order.id}`} 
                                                    className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-50 transition"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>

                                                {/* 👇 5. Thêm Nút Xóa */}
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    disabled={deletingId === order.id}
                                                    className="inline-flex items-center px-3 py-1.5 border border-red-500 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Xóa đơn hàng"
                                                >
                                                    {deletingId === order.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        Không tìm thấy đơn hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}