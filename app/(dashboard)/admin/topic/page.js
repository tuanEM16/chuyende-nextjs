'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TopicService from '@/services/TopicService';

// Icons
const PlusIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

export default function TopicListPage() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            // Thêm limit lớn để lấy hết danh sách nếu backend có phân trang
            const res = await TopicService.index({ limit: 1000 });
            
            if (res.data && res.data.success) {
                // 👇 Xử lý an toàn: Lấy mảng dù API trả về phân trang hay không
                const list = res.data.data?.data || res.data.data || [];
                setTopics(list);
            }
        } catch (error) {
            console.error("Lỗi tải chủ đề:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(confirm("Bạn có chắc muốn xóa chủ đề này?")) {
            try {
                await TopicService.destroy(id);
                // Load lại dữ liệu sau khi xóa
                loadData(); 
            } catch (error) {
                alert("Xóa thất bại: " + (error.message || "Lỗi server"));
            }
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Chủ đề (Topic)</h1>
                <Link href="/admin/topic/add" className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition shadow">
                    <PlusIcon /> <span>Thêm Chủ đề</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tên Chủ đề</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Thứ tự</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-10 text-slate-500 italic">Đang tải dữ liệu...</td></tr>
                        ) : topics.length > 0 ? (
                            topics.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{item.slug}</td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold">{item.sort_order}</td>
                                    <td className="px-6 py-4 text-center">
                                        {item.status === 1 ? 
                                            <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">Hiện</span> : 
                                            <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">Ẩn</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <Link href={`/admin/topic/${item.id}/edit`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded hover:bg-indigo-100 transition" title="Sửa">
                                                <EditIcon/>
                                            </Link>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded hover:bg-red-100 transition" title="Xóa">
                                                <TrashIcon/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-10 text-slate-500">Chưa có chủ đề nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}