'use client';

import { useState } from 'react';

// --- ICONS ---
const EditIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const TrashIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const PlusIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
// --- END ICONS ---

export default function CategoryPage() {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Thời trang', slug: 'thoi-trang', count: 50 },
        { id: 2, name: 'Thiết bị điện tử', slug: 'thiet-bi-dien-tu', count: 120 },
        { id: 3, name: 'Sách', slug: 'sach', count: 34 },
        { id: 4, name: 'Gia dụng', slug: 'gia-dung', count: 12 },
    ]);

    const handleDelete = (id) => {
        if(confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Danh mục</h1>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">
                    <PlusIcon />
                    <span>Thêm Danh mục</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tên danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Số lượng SP</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{category.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{category.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{category.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-semibold">{category.count}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3 flex justify-center">
                                    <button className="text-indigo-600 hover:text-indigo-900"><EditIcon /></button>
                                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}