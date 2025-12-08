'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BannerService from '@/services/BannerService';

// Icons
const PlusIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

export default function BannerList() {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await BannerService.index();
            if (res.success) setBanners(res.data.data || res.data || []);
        })();
    }, []);

    const handleDelete = async (id) => {
        if(confirm('Xóa banner này?')) {
            await BannerService.destroy(id);
            setBanners(banners.filter(b => b.id !== id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Banner</h1>
                <Link href="/admin/banner/add" className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    <PlusIcon /> <span>Thêm Banner</span>
                </Link>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên & Link</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {banners.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <img src={BannerService.getImageUrl(item.image)} alt={item.name} className="h-16 w-32 object-cover rounded border"/>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{item.name}</div>
                                    <div className="text-xs text-blue-500">{item.link || '#'}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 capitalize">{item.position}</td>
                                <td className="px-6 py-4 text-center">
                                    {item.status === 1 ? 
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Hiện</span> : 
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Ẩn</span>
                                    }
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <Link href={`/admin/banner/${item.id}/edit`} className="text-indigo-600 hover:text-indigo-900"><EditIcon/></Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><TrashIcon/></button>
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