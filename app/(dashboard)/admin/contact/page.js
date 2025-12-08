'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ContactService from '@/services/ContactService';

// --- ICONS ---
const EyeIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const TrashIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const CheckIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

export default function ContactListPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await ContactService.index();
            if (res.success) {
                setContacts(res.data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc muốn xóa liên hệ này?")) {
            try {
                await ContactService.destroy(id);
                setContacts(contacts.filter(c => c.id !== id));
            } catch (error) {
                alert("Xóa thất bại");
            }
        }
    };

    // Hàm đánh dấu đã xong nhanh
    const handleMarkAsDone = async (id) => {
        try {
            await ContactService.reply(id, { status: 2 });
            // Cập nhật lại state local để UI đổi màu
            setContacts(contacts.map(c => c.id === id ? { ...c, status: 2 } : c));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Danh sách Liên hệ</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Khách hàng</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Tiêu đề / Nội dung</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Ngày gửi</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr><td colSpan="5" className="p-6 text-center text-slate-500">Đang tải...</td></tr>
                            ) : contacts.length > 0 ? (
                                contacts.map((contact) => (
                                    <tr key={contact.id} className={`hover:bg-slate-50 transition ${contact.status === 1 ? 'bg-indigo-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{contact.name}</div>
                                            <div className="text-xs text-slate-500">{contact.email}</div>
                                            <div className="text-xs text-slate-500">{contact.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700 line-clamp-2 max-w-xs" title={contact.content}>
                                                {contact.title || contact.content}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(contact.created_at).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {contact.status === 1 ? (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Mới</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Đã xử lý</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-3">
                                                {/* Nút đánh dấu đã xong */}
                                                {contact.status === 1 && (
                                                    <button onClick={() => handleMarkAsDone(contact.id)} className="text-green-600 hover:text-green-800" title="Đánh dấu đã xử lý">
                                                        <CheckIcon />
                                                    </button>
                                                )}
                                                {/* Nút xem chi tiết */}
                                                <Link href={`/admin/contact/${contact.id}`} className="text-indigo-600 hover:text-indigo-900" title="Xem chi tiết">
                                                    <EyeIcon />
                                                </Link>
                                                {/* Nút xóa */}
                                                <button onClick={() => handleDelete(contact.id)} className="text-red-500 hover:text-red-700" title="Xóa">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="p-6 text-center text-slate-500">Không có liên hệ nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}