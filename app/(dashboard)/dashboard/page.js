'use client';

// --- INLINE SVG COMPONENTS (Dùng Inline SVG để tránh lỗi thư viện) ---
const Icon = ({ path, size = 24, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
);
const DollarSign = (props) => <Icon path={["M12 1v22","M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]} {...props} />;
const ShoppingBag = (props) => <Icon path={["M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z","M3 6h18","M16 10a4 4 0 0 1-8 0"]} {...props} />;
const Users = (props) => <Icon path={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z","M22 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 1 1 0 7.75"]} {...props} />;
const Activity = (props) => <Icon path="M22 12h-4l-3 9L9 3l-3 9H2" {...props} />;
// --- END ICONS ---

export default function DashboardPage() {
    const stats = [
        { title: 'Tổng Doanh thu', value: '120,500,000₫', icon: DollarSign, color: 'bg-green-500' },
        { title: 'Đơn hàng Mới', value: '24', icon: ShoppingBag, color: 'bg-blue-500' },
        { title: 'Khách hàng', value: '1,203', icon: Users, color: 'bg-indigo-500' },
        { title: 'Truy cập Hôm nay', value: '5,420', icon: Activity, color: 'bg-orange-500' },
    ];

    const recentOrders = [
        { id: '#ORD-001', customer: 'Nguyễn Văn A', total: '250,000₫', status: 'Hoàn thành', date: '2025-05-10' },
        { id: '#ORD-002', customer: 'Trần Thị B', total: '1,200,000₫', status: 'Đang xử lý', date: '2025-05-09' },
        { id: '#ORD-003', customer: 'Lê Văn C', total: '500,000₫', status: 'Hủy', date: '2025-05-08' },
        { id: '#ORD-004', customer: 'Phạm Thị D', total: '750,000₫', status: 'Hoàn thành', date: '2025-05-08' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Tổng quan Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const IconComp = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 hover:shadow-lg transition">
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

            {/* Recent Orders & Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Đơn hàng gần đây</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 border-b">
                                    <th className="pb-3 font-medium">Mã đơn</th>
                                    <th className="pb-3 font-medium">Khách hàng</th>
                                    <th className="pb-3 font-medium">Tổng tiền</th>
                                    <th className="pb-3 font-medium">Trạng thái</th>
                                    <th className="pb-3 font-medium">Ngày</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b last:border-0 hover:bg-slate-50">
                                        <td className="py-3 font-medium text-indigo-600">{order.id}</td>
                                        <td className="py-3 text-slate-700">{order.customer}</td>
                                        <td className="py-3 text-slate-700">{order.total}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Đang xử lý' ? 'bg-blue-100 text-blue-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-slate-500">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Activity */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Hoạt động mới</h2>
                    <ul className="space-y-4">
                        <li className="flex items-start space-x-3">
                            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                            <p className="text-sm text-slate-600"><span className="font-bold text-slate-800">Admin</span> đã thêm sản phẩm mới "Sony Alpha A7". <br/><span className="text-xs text-slate-400">2 phút trước</span></p>
                        </li>
                        <li className="flex items-start space-x-3">
                            <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                            <p className="text-sm text-slate-600">Đơn hàng mới <span className="font-bold text-slate-800">#ORD-005</span> đã được thanh toán. <br/><span className="text-xs text-slate-400">15 phút trước</span></p>
                        </li>
                        <li className="flex items-start space-x-3">
                            <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full"></div>
                            <p className="text-sm text-slate-600">Người dùng <span className="font-bold text-slate-800">Minh Tuấn</span> vừa đăng ký tài khoản. <br/><span className="text-xs text-slate-400">1 giờ trước</span></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}