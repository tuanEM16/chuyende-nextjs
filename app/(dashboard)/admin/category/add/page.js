'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- INLINE SVG ICONS ---
const ArrowLeftIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const SaveIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);
// --- END ICONS ---

export default function AddCategoryPage() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');

    // Hàm tự động tạo slug từ tên
    const generateSlug = (value) => {
        return value
            .toLowerCase()
            .normalize('NFD') // Chuẩn hóa unicode để loại bỏ dấu
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '') // Bỏ ký tự đặc biệt
            .trim()
            .replace(/\s+/g, '-'); // Thay khoảng trắng bằng dấu gạch ngang
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setSlug(generateSlug(value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, slug, description });
        alert('Thêm danh mục thành công! (Giả lập)');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Thêm Danh mục</h1>
                <Link href="/dashboard/admin/category" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tên danh mục</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={handleNameChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="Ví dụ: Thời trang Nam"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Slug (Đường dẫn)</label>
                        <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="vi-du-thoi-trang-nam"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả</label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="Mô tả ngắn về danh mục này..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
                        >
                            <SaveIcon />
                            <span>Lưu Danh mục</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}