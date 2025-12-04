'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

// Component Icon Lịch (Dùng SVG thay vì lucide-react để đồng bộ với các trang khác)
const CalendarIcon = ({ size = 16, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const PostCard = ({ post }) => {
    // Cấu hình URL ảnh (Thay 'product' bằng 'post' nếu bạn lưu ảnh bài viết ở folder khác)
    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/post/';

    const getImageUrl = (filename) => {
        if (!filename) return "https://placehold.co/600x400?text=No+Image";
        if (filename.startsWith('http')) return filename;
        return IMAGE_BASE_URL + filename;
    };

    // Format ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-slate-100">
            {/* Hình ảnh bài viết */}
            <div className="h-48 overflow-hidden relative">
                <img 
                    src={getImageUrl(post.image)} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Error"; }}
                />
            </div>

            <div className="p-6 flex flex-col flex-grow space-y-3">
                <h2 className="text-xl font-bold text-slate-800 hover:text-indigo-600 transition duration-300 line-clamp-2">
                    <Link href={`/post/${post.id}`}>{post.title}</Link>
                </h2>
                
                <div className="flex items-center text-sm text-slate-500">
                    <CalendarIcon className="mr-2" />
                    <span>{formatDate(post.created_at)}</span>
                </div>
                
                <p className="text-slate-600 flex-grow line-clamp-3 text-sm leading-relaxed">
                    {post.description || post.summary || "Chưa có mô tả cho bài viết này."}
                </p>
                
                <Link href={`/post/${post.id}`} className="text-indigo-600 font-medium hover:text-indigo-800 pt-4 border-t border-slate-100 self-start w-full flex items-center">
                    Đọc thêm 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
            </div>
        </div>
    );
};

export default function PostPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Gọi API lấy danh sách bài viết
                const res = await axios.get('http://127.0.0.1:8000/api/post');
                
                if (res.data.success) {
                    // Xử lý data trả về (paginate hoặc get)
                    const dataSrc = res.data.data.data || res.data.data || [];
                    setPosts(dataSrc);
                }
            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-8 border-b border-slate-200 pb-3">
                Blog & Tin tức
            </h1>

            {loading ? (
                // Skeleton Loading
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow p-4 h-96 animate-pulse">
                            <div className="h-48 bg-slate-200 rounded mb-4"></div>
                            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                            <div className="h-20 bg-slate-200 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                    
                    {posts.length === 0 && (
                        <div className="text-center p-12 bg-white rounded-xl mt-8 shadow-sm">
                            <p className="text-xl text-slate-500">Hiện chưa có bài viết nào được đăng.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}