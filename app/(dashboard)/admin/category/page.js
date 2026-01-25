'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import CategoryService from '@/services/CategoryService'; 


const Icon = ({ path, size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
);

const SearchIcon = (props) => <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" {...props} />;
const PlusIcon = (props) => <Icon path={["M12 5v14","M5 12h14"]} {...props} />;
const EditIcon = (props) => <Icon path={["M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"]} {...props} />;
const Trash2Icon = (props) => <Icon path={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M10 11v6","M14 11v6","M15 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"]} {...props} />;
const EyeIcon = (props) => <Icon path={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-1 12z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} {...props} />;


export default function CategoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await CategoryService.index();
                
                if (res.data && (res.data.success || Array.isArray(res.data.data) || Array.isArray(res.data))) {
                    setCategories(res.data.data || res.data || []);
                }
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                await CategoryService.destroy(id);
                setCategories(categories.filter(c => c.id !== id));
                alert("Đã xóa thành công!");
            } catch (error) {
                console.error("Lỗi xóa:", error);
                alert("Xóa thất bại! Có thể danh mục này đang chứa sản phẩm.");
            }
        }
    };


    const filteredCategories = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return categories.filter(category =>
            category.name?.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchTerm, categories]);

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Danh mục</h1>
                <Link 
                    href="/admin/category/add" 
                    className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md w-full sm:w-auto"
                >
                    <PlusIcon size={20} />
                    <span>Thêm Danh mục</span>
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="text-slate-400" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục theo tên..."
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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Hình ảnh</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Tên danh mục</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Slug</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Thứ tự</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{category.id}</td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-12 w-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                <img 
                                                    src={CategoryService.getImageUrl(category.image)} 
                                                    alt={category.name} 
                                                    className="h-full w-full object-cover"
                                                    onError={CategoryService.handleImageError}
                                                />
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">
                                                {category.name}
                                                {category.parent_id !== 0 && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                        Con
                                                    </span>
                                                )}
                                            </div>
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

                                        {/* --- CỘT HÀNH ĐỘNG --- */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-3">
                                                
                                                {/* Nút Xem Chi Tiết (ĐÃ SỬA URL) */}
                                                <Link 
                                                    href={`/admin/category/${category.id}/show`} 
                                                    className="text-blue-500 hover:text-blue-700 transition"
                                                    title="Xem chi tiết"
                                                >
                                                    <EyeIcon size={18} />
                                                </Link>

                                                {/* Nút Sửa */}
                                                <Link 
                                                    href={`/admin/category/${category.id}/edit`} 
                                                    className="text-indigo-600 hover:text-indigo-900 transition"
                                                    title="Chỉnh sửa"
                                                >
                                                    <EditIcon size={18} />
                                                </Link>

                                                {/* Nút Xóa */}
                                                <button 
                                                    onClick={() => handleDelete(category.id)} 
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
                                    <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                                        Không tìm thấy danh mục nào.
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