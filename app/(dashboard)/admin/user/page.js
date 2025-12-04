'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

// --- ICONS ---
const PlusIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const TrashIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
// --- END ICONS ---

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Gọi API lấy danh sách User
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/user');
                if (res.data.success) {
                    // Laravel paginate trả về data.data.data, hoặc data.data tùy controller
                    setUsers(res.data.data.data || res.data.data || []);
                }
            } catch (error) {
                console.error("Lỗi tải danh sách người dùng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // 2. Xử lý xóa User
    const handleDelete = async (id) => {
        if(window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/user/${id}`);
                setUsers(users.filter(u => u.id !== id));
                alert("Đã xóa thành công!");
            } catch (error) {
                alert("Xóa thất bại! Có thể do lỗi server.");
            }
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Người dùng</h1>
                <Link 
                    href="/admin/user/add" 
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
                >
                    <PlusIcon />
                    <span>Thêm Thành viên</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
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
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-slate-200">
                                            {/* Nếu có ảnh thì hiện ảnh, không thì hiện chữ cái đầu */}
                                            {user.avatar ? (
                                                <img src={`http://127.0.0.1:8000/images/user/${user.avatar}`} alt={user.name} className="h-full w-full object-cover" />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                        <div className="text-xs text-slate-500">{user.email}</div>
                                        <div className="text-xs text-slate-500">{user.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-700 font-medium">@{user.username}</div>
                                        <div className="text-xs text-green-600">Active</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.roles === 'admin' ? (
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Admin</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Khách hàng</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-3">
                                            <Link href={`/admin/user/edit/${user.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                <EditIcon />
                                            </Link>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Chưa có thành viên nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}