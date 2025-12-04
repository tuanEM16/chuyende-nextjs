'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

// --- ICONS ---
const EditIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const TrashIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const PlusIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
// --- END ICONS ---

export default function AdminPostPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Đường dẫn ảnh (Bạn nhớ tạo thư mục public/images/post trong Laravel nhé)
    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/post/';

    // 1. Gọi API lấy danh sách bài viết
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/post');
                if (res.data.success) {
                    // Xử lý trường hợp có phân trang (res.data.data.data) hoặc không (res.data.data)
                    setPosts(res.data.data.data || res.data.data || []);
                }
            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // 2. Xử lý xóa bài viết
    const handleDelete = async (id) => {
        if(window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/post/${id}`);
                // Cập nhật lại giao diện sau khi xóa thành công
                setPosts(posts.filter(p => p.id !== id));
                alert("Đã xóa bài viết!");
            } catch (error) {
                console.error("Lỗi xóa:", error);
                alert("Xóa thất bại!");
            }
        }
    };

    // 3. Helper hiển thị ảnh an toàn
    const renderImage = (filename) => {
        if (!filename) return "https://placehold.co/80x50?text=No+Img";
        return filename.startsWith('http') ? filename : IMAGE_BASE_URL + filename;
    };

    // 4. Helper format ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN'); // Hiển thị kiểu ngày Việt Nam
    };

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Bài viết</h1>
                {/* Đổi button thành Link để chuyển trang thêm mới */}
                <Link 
                    href="/admin/post/add" 
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
                >
                    <PlusIcon />
                    <span>Viết bài mới</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hình ảnh</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tiêu đề</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày đăng</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td>
                            </tr>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50 transition">
                                    {/* Cột Hình ảnh */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-12 w-20 rounded overflow-hidden border border-slate-200">
                                            <img 
                                                src={renderImage(post.image)} 
                                                alt={post.title} 
                                                className="h-full w-full object-cover"
                                                onError={(e) => { e.target.src = "https://placehold.co/80x50?text=Error"; }}
                                            />
                                        </div>
                                    </td>

                                    {/* Cột Tiêu đề */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-900 line-clamp-1">{post.title}</div>
                                        <div className="text-xs text-slate-500">{post.slug}</div>
                                    </td>

                                    {/* Cột Ngày đăng */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {formatDate(post.created_at)}
                                    </td>

                                    {/* Cột Trạng thái */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {post.status === 1 ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Xuất bản
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Nháp
                                            </span>
                                        )}
                                    </td>

                                    {/* Cột Hành động */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-3">
                                            <Link href={`/admin/post/edit/${post.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                <EditIcon />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(post.id)} 
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
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                    Chưa có bài viết nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}