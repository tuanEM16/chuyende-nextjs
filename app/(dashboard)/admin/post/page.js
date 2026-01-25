'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PostService from '@/services/PostService';


const PlusIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const EditIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

const EyeIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await PostService.index();

                const data = res.data?.data?.data || res.data?.data || []; 
                setPosts(data);
            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if(confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                await PostService.destroy(id);
                setPosts(posts.filter(p => p.id !== id));
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    if(loading) return <div className="p-6 text-center text-slate-500">Đang tải danh sách...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Bài viết</h1>
                <Link href="/admin/post/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shadow">
                    <PlusIcon /> <span>Thêm Bài viết</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Hình ảnh</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Tiêu đề</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Ngày tạo</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {posts.map(post => (
                            <tr key={post.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <img 
                                        src={PostService.getImageUrl(post.image)} 
                                        className="w-16 h-12 object-cover rounded border"
                                        alt={post.title}
                                        onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image"; }}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900 line-clamp-1" title={post.title}>{post.title}</p>
                                    <p className="text-xs text-slate-500">Slug: {post.slug}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {post.status === 1 ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Hiện</span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Ẩn</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        {/* Nút Xem chi tiết (Link tới file /show/page.js bạn vừa tạo) */}
                                        <Link 
                                            href={`/admin/post/${post.id}/show`} 
                                            className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full" 
                                            title="Xem chi tiết"
                                        >
                                            <EyeIcon />
                                        </Link>

                                        {/* Nút Sửa */}
                                        <Link 
                                            href={`/admin/post/${post.id}/edit`} 
                                            className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-full" 
                                            title="Sửa"
                                        >
                                            <EditIcon />
                                        </Link>

                                        {/* Nút Xóa */}
                                        <button 
                                            onClick={() => handleDelete(post.id)} 
                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full" 
                                            title="Xóa"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-500 italic">
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