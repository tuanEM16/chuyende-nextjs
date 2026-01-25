'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BannerService from '@/services/BannerService';


const PlusIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const TrashIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const EditIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const EyeIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
export default function BannerList() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await BannerService.index();

                const data = res.data?.data || res.data || [];
                setBanners(data);
            } catch (error) {
                console.error("Lỗi tải banner:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa banner này?")) {
            try {
                await BannerService.destroy(id);
                setBanners(banners.filter(b => b.id !== id));
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    if (loading) return <div className="p-6 text-center text-slate-500">Đang tải danh sách...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Banner</h1>
                <Link href="/admin/banner/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shadow">
                    <PlusIcon /> <span>Thêm Banner</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Hình ảnh</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Tên Banner</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Vị trí</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Thứ tự</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {banners.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <img
                                        src={BannerService.getImageUrl(item.image)}
                                        className="w-24 h-12 object-cover rounded border"
                                        alt={item.name}
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                <td className="px-6 py-4 text-slate-600 capitalize">{item.position}</td>
                                <td className="px-6 py-4 text-center text-slate-600">{item.sort_order}</td>
                                <td className="px-6 py-4 text-center">
                                    {item.status === 1 ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Hiện</span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Ẩn</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-3">
                                        <Link href={`/admin/banner/${item.id}/show`} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full">
                                            <EyeIcon />
                                        </Link>
                                        <Link href={`/admin/banner/${item.id}/edit`} className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-full">
                                            <EditIcon />
                                        </Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}