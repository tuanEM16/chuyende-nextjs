'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

// --- ICONS ---
const EditIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const TrashIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const PlusIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
// --- END ICONS ---

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cấu hình đường dẫn ảnh (Tạo thư mục public/images/category trong Laravel)
    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/category/';

    // 1. Gọi API lấy danh sách danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/category');
                if (res.data.success) {
                    setCategories(res.data.data || []);
                }
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // 2. Xử lý xóa danh mục
    const handleDelete = async (id) => {
        if(confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/category/${id}`);
                setCategories(categories.filter(c => c.id !== id));
                alert("Đã xóa thành công!");
            } catch (error) {
                console.error(error);
                alert("Xóa thất bại! Có thể danh mục này đang chứa sản phẩm.");
            }
        }
    };

    // 3. Helper hiển thị ảnh
    const renderImage = (img) => {
        if (!img) return "https://placehold.co/50x50?text=No+Img";
        return img.startsWith('http') ? img : IMAGE_BASE_URL + img;
    };

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Danh mục</h1>
                
                <Link 
                    href="/admin/category/add" 
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
                >
                    <PlusIcon />
                    <span>Thêm Danh mục</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hình ảnh</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên danh mục</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Thứ tự</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td>
                            </tr>
                        ) : categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{category.id}</td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-10 w-10 rounded border border-slate-200 overflow-hidden">
                                            <img 
                                                src={renderImage(category.image)} 
                                                alt={category.name} 
                                                className="h-full w-full object-cover"
                                                onError={(e) => { e.target.src = "https://placehold.co/50x50?text=Error"; }}
                                            />
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                        {category.name}
                                        {category.parent_id !== 0 && <span className="ml-2 text-xs text-slate-400">(Con)</span>}
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{category.slug}</td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">{category.sort_order}</td>

                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {category.status === 1 ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Hiện</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Ẩn</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-center space-x-3">
                                            {/* --- SỬA LỖI ĐƯỜNG DẪN TẠI ĐÂY --- */}
                                            <Link href={`/admin/category/${category.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                                                <EditIcon />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(category.id)} 
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                    Chưa có danh mục nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}