'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import PostService from '@/services/PostService'; // Import Service

// --- ICONS (Đồng bộ bộ icon chuẩn) ---
const Icon = ({ path, size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
);
const SearchIcon = (props) => <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" {...props} />;
const PlusIcon = (props) => <Icon path={["M12 5v14","M5 12h14"]} {...props} />;
const EditIcon = (props) => <Icon path={["M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"]} {...props} />;
const Trash2Icon = (props) => <Icon path={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M10 11v6","M14 11v6","M15 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"]} {...props} />;
// --- END ICONS ---

export default function AdminPostPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Lấy dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await PostService.index();
                if (res.success) {
                    // Xử lý linh hoạt data có phân trang hoặc không
                    setPosts(res.data.data?.data || res.data.data || []); 
                }
            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Xử lý xóa
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
            try {
                await PostService.destroy(id);
                setPosts(posts.filter(p => p.id !== id));
                alert("Đã xóa bài viết thành công!");
            } catch (error) {
                console.error("Lỗi xóa:", error);
                alert("Xóa thất bại!");
            }
        }
    };

    // 3. Filter tìm kiếm
    const filteredPosts = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return posts.filter(post =>
            post.title?.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchTerm, posts]);

    // Helper format ngày
    const formatDate = (dateString) => {
        if (!dateString) return '---';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Bài viết</h1>
                <Link 
                    href="/admin/post/add" 
                    className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md w-full sm:w-auto"
                >
                    <PlusIcon size={20} />
                    <span>Viết bài mới</span>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="text-slate-400" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết theo tiêu đề..."
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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Hình ảnh</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Tiêu đề</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Ngày đăng</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : filteredPosts.length > 0 ? (
                                filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-12 w-20 rounded-md overflow-hidden border border-slate-200 bg-slate-100">
                                                <img 
                                                    src={PostService.getImageUrl(post.image)} 
                                                    alt={post.title} 
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => { 
                                                        e.target.onerror = null;
                                                        e.target.src = "https://placehold.co/80x50?text=No+Img"; 
                                                    }}
                                                />
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900 line-clamp-1" title={post.title}>
                                                {post.title}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 max-w-[200px] truncate">
                                                {post.slug}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {formatDate(post.created_at)}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {post.status === 1 ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                    Xuất bản
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                                    Nháp
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-3">
                                                <Link 
                                                    href={`/admin/post/edit/${post.id}`} 
                                                    className="text-indigo-600 hover:text-indigo-900 transition"
                                                    title="Chỉnh sửa"
                                                >
                                                    <EditIcon size={18} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(post.id)} 
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
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        Không tìm thấy bài viết nào.
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