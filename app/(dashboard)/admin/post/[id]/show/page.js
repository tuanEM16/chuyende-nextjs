'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PostService from '@/services/PostService';


const ArrowLeftIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const EditIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const CalendarIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;

export default function PostDetail({ params: paramsPromise }) {

    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!id) return;
        const fetchPost = async () => {
            try {
                const res = await PostService.show(id);

                const data = res.data?.data || res.data;
                setPost(data);
            } catch (error) {
                console.error("Lỗi tải chi tiết:", error);
                alert("Không tìm thấy bài viết hoặc có lỗi xảy ra!");
                router.push('/admin/post');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, router]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-slate-500">Đang tải dữ liệu...</span>
        </div>
    );

    if (!post) return <div className="p-10 text-center text-red-500 font-bold">Bài viết không tồn tại.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            
            {/* --- HEADER: Back btn & Title --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/post" className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition shadow-sm" title="Quay lại danh sách">
                        <ArrowLeftIcon />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Chi tiết Bài viết</h1>
                        <p className="text-xs text-slate-500 mt-1">Xem thông tin đầy đủ của bài viết</p>
                    </div>
                </div>
                
                <Link 
                    href={`/admin/post/${post.id}/edit`} 
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-md font-medium"
                >
                    <EditIcon /> <span>Chỉnh sửa bài này</span>
                </Link>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* CỘT TRÁI (3 phần): Thông tin Metadata & Ảnh */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Ảnh đại diện */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Ảnh đại diện</h3>
                        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group">
                            <img 
                                src={PostService.getImageUrl(post.image)} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image"; }}
                            />
                        </div>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4 divide-y divide-slate-100">
                        <h3 className="font-bold text-slate-700 mb-1 text-sm uppercase tracking-wider pb-2 border-b-0">Thông tin chung</h3>
                        
                        <div className="pt-3">
                            <span className="text-xs text-slate-400 block uppercase font-bold">ID Hệ thống</span>
                            <span className="font-mono text-sm text-slate-800 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">#{post.id}</span>
                        </div>
                        
                        <div className="pt-3">
                            <span className="text-xs text-slate-400 block uppercase font-bold">Trạng thái</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${post.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <span className={`w-2 h-2 rounded-full mr-1.5 ${post.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {post.status === 1 ? 'Xuất bản (Active)' : 'Đang ẩn (Hidden)'}
                            </span>
                        </div>

                        <div className="pt-3">
                            <span className="text-xs text-slate-400 block uppercase font-bold">Ngày tạo</span>
                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-700 font-medium">
                                <CalendarIcon />
                                {new Date(post.created_at).toLocaleString('vi-VN')}
                            </div>
                        </div>

                        <div className="pt-3">
                            <span className="text-xs text-slate-400 block uppercase font-bold">Loại bài viết</span>
                            <span className="text-sm text-slate-700 font-medium capitalize mt-1 block">
                                {post.post_type}
                            </span>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI (9 phần): Nội dung bài viết */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[600px]">
                        
                        {/* Tiêu đề lớn */}
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Slug */}
                        <div className="mb-6 bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-500 flex items-center gap-2 overflow-x-auto">
                            <span className="font-bold whitespace-nowrap">SLUG:</span>
                            <span className="font-mono text-indigo-600">{post.slug}</span>
                        </div>

                        {/* Mô tả ngắn */}
                        {post.description && (
                            <div className="bg-indigo-50 p-5 rounded-lg border-l-4 border-indigo-500 mb-8">
                                <h4 className="text-indigo-900 font-bold text-sm mb-2 uppercase">Mô tả ngắn</h4>
                                <p className="text-indigo-800 italic text-lg leading-relaxed">
                                    {post.description}
                                </p>
                            </div>
                        )}

                        <hr className="my-8 border-slate-100" />

                        {/* Nội dung HTML (Render từ CKEditor hoặc Textarea) */}
                        <div className="prose prose-lg prose-indigo max-w-none text-slate-700">
                            {/* QUAN TRỌNG: Render HTML từ cột content */}
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}