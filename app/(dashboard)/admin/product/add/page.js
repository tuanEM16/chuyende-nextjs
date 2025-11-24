'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- INLINE SVG ---
const SaveIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);
const ArrowLeftIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
// --- END ICONS ---

export default function AddProductPage() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dữ liệu sản phẩm:', formData);
        alert('Đã thêm sản phẩm thành công! (Giả lập)');
        // Tại đây bạn sẽ gọi API để lưu vào database
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Thêm Sản phẩm mới</h1>
                <Link href="/dashboard/admin/product" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tên sản phẩm */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tên sản phẩm</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="Nhập tên sản phẩm..."
                        />
                    </div>

                    {/* Danh mục */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        >
                            <option value="">Chọn danh mục</option>
                            <option value="Thời trang">Thời trang</option>
                            <option value="Thiết bị điện tử">Thiết bị điện tử</option>
                            <option value="Sách">Sách</option>
                            <option value="Gia dụng">Gia dụng</option>
                        </select>
                    </div>

                    {/* Giá */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Giá (VNĐ)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="0"
                        />
                    </div>

                    {/* Tồn kho */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Số lượng tồn kho</label>
                        <input
                            type="number"
                            name="stock"
                            required
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* URL Hình ảnh */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">URL Hình ảnh</label>
                    <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả sản phẩm</label>
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        placeholder="Mô tả chi tiết về sản phẩm..."
                    ></textarea>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => setFormData({ name: '', category: '', price: '', stock: '', description: '', imageUrl: '' })}
                        className="mr-4 px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition font-medium"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
                    >
                        <SaveIcon />
                        <span>Lưu sản phẩm</span>
                    </button>
                </div>
            </form>
        </div>
    );
}