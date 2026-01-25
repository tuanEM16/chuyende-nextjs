'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PostService from '@/services/PostService';


const CalendarIcon = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const ClockIcon = ({ size = 40, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);


const PostCard = ({ post }) => {

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full group">
            {/* Hình ảnh Thumbnail */}
            <Link href={`/post/${post.slug || post.id}`} className="block h-56 overflow-hidden relative bg-slate-100">
                <img 
                    src={PostService.getImageUrl(post.image)} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image"; }}
                />
                {/* Overlay nhẹ khi hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
            </Link>

            {/* Nội dung bài viết */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Meta data: Ngày tháng */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">
                    <CalendarIcon className="text-indigo-500" />
                    <span>{formatDate(post.created_at)}</span>
                </div>

                {/* Tiêu đề */}
                <h2 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    <Link href={`/post/${post.slug || post.id}`}>
                        {post.title}
                    </Link>
                </h2>
                
                {/* Mô tả ngắn (Excerpt) */}
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {post.description || "Bài viết này chưa có mô tả ngắn. Hãy bấm vào để xem chi tiết nội dung..."}
                </p>
                
                {/* Nút Xem thêm */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <Link 
                        href={`/post/${post.slug || post.id}`} 
                        className="text-indigo-600 font-bold text-sm hover:text-indigo-800 flex items-center gap-2 group/btn"
                    >
                        ĐỌC TIẾP 
                        <span className="transform group-hover/btn:translate-x-1 transition-transform">
                            <ArrowRightIcon />
                        </span>
                    </Link>
                </div>
            </div>
        </article>
    );
};


export default function PostPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {

                const res = await PostService.index();
                



                let dataList = [];
                
                if (res.data?.data?.data && Array.isArray(res.data.data.data)) {

                    dataList = res.data.data.data;
                } else if (res.data?.data && Array.isArray(res.data.data)) {

                    dataList = res.data.data;
                }

                setPosts(dataList);

            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                        Tin tức & Sự kiện
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Cập nhật những thông tin mới nhất, kiến thức bổ ích và các thông báo quan trọng.
                    </p>
                    <div className="mt-4 w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
                </div>

                {/* Content Section */}
                {loading ? (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 h-[450px] border border-slate-200 shadow-sm">
                                <div className="h-48 bg-slate-200 rounded-xl mb-4 animate-pulse"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4 animate-pulse"></div>
                                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3 animate-pulse"></div>
                                <div className="h-6 bg-slate-200 rounded w-1/2 mb-6 animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
                                    <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
                                    <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (

                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
                                <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-4">
                                    <ClockIcon />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700">Chưa có bài viết nào</h3>
                                <p className="text-slate-500 mt-2">Nội dung đang được cập nhật. Vui lòng quay lại sau!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}