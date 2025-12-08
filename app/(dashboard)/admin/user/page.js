'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import UserService from '@/services/UserService'; // Import Service

// --- ICONS (Đồng bộ bộ icon chuẩn) ---
const Icon = ({ path, size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
);
const SearchIcon = (props) => <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" {...props} />;
const PlusIcon = (props) => <Icon path={["M12 5v14","M5 12h14"]} {...props} />;
const EditIcon = (props) => <Icon path={["M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"]} {...props} />;
const Trash2Icon = (props) => <Icon path={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M10 11v6","M14 11v6","M15 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"]} {...props} />;
// --- END ICONS ---

export default function AdminUserPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Lấy dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await UserService.index();
                if (res.success) {
                    setUsers(res.data.data?.data || res.data.data || []); 
                }
            } catch (error) {
                console.error("Lỗi tải người dùng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Xử lý xóa
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
            try {
                await UserService.destroy(id);
                setUsers(users.filter(u => u.id !== id));
                alert("Đã xóa thành công!");
            } catch (error) {
                console.error("Lỗi xóa:", error);
                alert("Xóa thất bại! Có thể do lỗi server.");
            }
        }
    };

    // 3. Filter tìm kiếm (Tìm theo Tên, Email hoặc Username)
    const filteredUsers = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return users.filter(user =>
            user.name?.toLowerCase().includes(lowerCaseSearch) ||
            user.email?.toLowerCase().includes(lowerCaseSearch) ||
            user.username?.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchTerm, users]);

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Người dùng</h1>
                <Link 
                    href="/admin/user/add" 
                    className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md w-full sm:w-auto"
                >
                    <PlusIcon size={20} />
                    <span>Thêm Thành viên</span>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="text-slate-400" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, tài khoản..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Avatar</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Thông tin cá nhân</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Tài khoản</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Vai trò</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition duration-150">
                                        
                                        {/* Avatar Column */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                                                {user.avatar ? (
                                                    <img 
                                                        src={UserService.getImageUrl(user.avatar)} 
                                                        alt={user.name} 
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => { 
                                                            e.target.style.display = 'none'; // Ẩn ảnh lỗi để hiện background div
                                                        }}
                                                    />
                                                ) : (
                                                    // Fallback: Chữ cái đầu tên
                                                    user.name?.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                        </td>

                                        {/* Info Column */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                            {user.phone && <div className="text-xs text-slate-400 mt-0.5">{user.phone}</div>}
                                        </td>

                                        {/* Account Column */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-700 font-medium">@{user.username}</div>
                                            <div className="text-xs text-green-600 font-medium mt-1">Active</div>
                                        </td>

                                        {/* Role Column */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.roles === 'admin' ? (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                                                    Khách hàng
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions Column */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-3">
                                                <Link 
                                                    href={`/admin/user/edit/${user.id}`} 
                                                    className="text-indigo-600 hover:text-indigo-900 transition"
                                                    title="Chỉnh sửa"
                                                >
                                                    <EditIcon size={18} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(user.id)} 
                                                    className="text-red-400 hover:text-red-600 transition"
                                                    title="Xóa"
                                                >
                                                    <Trash2Icon size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        Không tìm thấy thành viên nào.
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