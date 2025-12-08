'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OrderService from '@/services/OrderService';
import UserService from '@/services/UserService';
import ProductService from '@/services/ProductService';
import ContactService from '@/services/ContactService';

// --- INLINE SVG ICONS ---
const Icon = ({ path, size = 24, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
);
const DollarSign = (props) => <Icon path={["M12 1v22","M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]} {...props} />;
const ShoppingBag = (props) => <Icon path={["M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z","M3 6h18","M16 10a4 4 0 0 1-8 0"]} {...props} />;
const Users = (props) => <Icon path={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z","M22 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 1 1 0 7.75"]} {...props} />;
const Package = (props) => <Icon path={["M16.5 9.4 7.55 4.24","M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z","M3.29 7 12 12.01 20.71 7","M12 12v10.06"]} {...props} />;
// --- END ICONS ---

export default function DashboardPage() {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        users: 0,
        products: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [newContacts, setNewContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Gọi song song các API
                const [orderRes, userRes, productRes, contactRes] = await Promise.all([
                    OrderService.index(),
                    UserService.index(),
                    ProductService.index(),
                    ContactService.index()
                ]);

                // 1. Tính Doanh thu & Đơn hàng
                let totalRevenue = 0;
                let ordersList = [];
                if (orderRes.success) {
                    ordersList = orderRes.data.data || orderRes.data || [];
                    ordersList.forEach(order => {
                        // Tính tổng tiền nếu có orderdetails
                        const orderTotal = OrderService.calculateTotal(order.orderdetails);
                        // Chỉ cộng tiền các đơn đã giao thành công (status = 3)
                        if (order.status === 3) { 
                            totalRevenue += orderTotal;
                        }
                    });
                }

                // 2. Đếm User
                let userCount = 0;
                if (userRes.success) {
                    const users = userRes.data.data || userRes.data || [];
                    userCount = users.length;
                }

                // 3. Đếm Product
                let productCount = 0;
                if (productRes.success) {
                    const products = productRes.data.data || productRes.data || [];
                    productCount = products.length;
                }

                // 4. Lấy Liên hệ mới nhất
                let contactsList = [];
                if (contactRes.success) {
                    const contacts = contactRes.data || [];
                    // Lọc tin mới (status=1) và lấy 5 tin đầu
                    contactsList = contacts.filter(c => c.status === 1).slice(0, 5); 
                }

                setStats({
                    revenue: totalRevenue,
                    orders: ordersList.length,
                    users: userCount,
                    products: productCount
                });

                // Lấy 6 đơn hàng mới nhất
                setRecentOrders(ordersList.slice(0, 6)); 
                setNewContacts(contactsList);

            } catch (error) {
                console.error("Lỗi tải Dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { title: 'Doanh thu (Đã giao)', value: stats.revenue.toLocaleString('vi-VN') + '₫', icon: DollarSign, color: 'bg-green-500' },
        { title: 'Tổng Đơn hàng', value: stats.orders, icon: ShoppingBag, color: 'bg-blue-500' },
        { title: 'Khách hàng', value: stats.users, icon: Users, color: 'bg-indigo-500' },
        { title: 'Sản phẩm', value: stats.products, icon: Package, color: 'bg-orange-500' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 1: return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Mới</span>;
            case 2: return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Giao hàng</span>;
            case 3: return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Hoàn thành</span>;
            case 4: return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Hủy</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Khác</span>;
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Đang tổng hợp số liệu...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Tổng quan Dashboard</h1>

            {/* Thống kê 4 ô màu */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const IconComp = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 hover:shadow-lg transition border border-slate-100">
                            <div className={`${stat.color} p-4 rounded-full text-white shadow-sm`}>
                                <IconComp size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bảng Đơn hàng mới nhất */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Đơn hàng mới nhất</h2>
                        <Link href="/admin/order" className="text-sm text-indigo-600 hover:underline">Xem tất cả</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 border-b bg-slate-50">
                                    <th className="pb-3 pl-2 font-medium py-3">Mã đơn</th>
                                    <th className="pb-3 font-medium">Khách hàng</th>
                                    <th className="pb-3 font-medium">Tổng tiền</th>
                                    <th className="pb-3 font-medium text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentOrders.length > 0 ? recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b last:border-0 hover:bg-slate-50">
                                        <td className="py-3 pl-2 font-medium text-indigo-600">#{order.id}</td>
                                        <td className="py-3 text-slate-700">{order.name}</td>
                                        <td className="py-3 font-bold text-slate-700">
                                            {OrderService.calculateTotal(order.orderdetails).toLocaleString('vi-VN')}₫
                                        </td>
                                        <td className="py-3 text-center">
                                            {getStatusBadge(order.status)}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="py-4 text-center text-slate-500">Chưa có đơn hàng nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Danh sách Liên hệ mới */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Liên hệ mới</h2>
                        <Link href="/admin/contact" className="text-sm text-indigo-600 hover:underline">Xem tất cả</Link>
                    </div>
                    <ul className="space-y-4">
                        {newContacts.length > 0 ? newContacts.map((contact) => (
                            <li key={contact.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition">
                                <div className="w-2 h-2 mt-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{contact.name}</p>
                                    <p className="text-xs text-slate-600 line-clamp-1">{contact.title || contact.content}</p>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(contact.created_at).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </li>
                        )) : (
                            <p className="text-sm text-slate-500 text-center py-4">Không có tin nhắn mới.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}