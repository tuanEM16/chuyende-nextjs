'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostService from '@/services/PostService';

export default function AddPost() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [content, setContent] = useState(''); 
    const [status, setStatus] = useState(1);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        

        formData.append('content', content); 
        
        formData.append('status', status);
        formData.append('post_type', 'post'); // Thêm cứng loại post
        
        if (image) {
            formData.append('image', image);
        }

        try {
            await PostService.store(formData);
            alert("Thêm bài viết thành công!");
            router.push('/admin/post');
        } catch (error) {
            console.error(error);
            alert("Lỗi khi thêm bài viết.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Thêm Bài viết Mới</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* CỘT TRÁI */}
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Tiêu đề bài viết</label>
                        <input 
                            type="text" required 
                            className="w-full border p-2 rounded outline-none focus:border-indigo-500"
                            placeholder="Nhập tiêu đề..."
                            value={title} onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Mô tả ngắn</label>
                        <textarea 
                            rows="3"
                            className="w-full border p-2 rounded outline-none focus:border-indigo-500"
                            placeholder="Giới thiệu sơ lược..."
                            value={description} onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Nội dung chi tiết</label>
                        {/* ĐÃ SỬA: value={content} */}
                        <textarea 
                            rows="10" required
                            className="w-full border p-2 rounded outline-none focus:border-indigo-500 font-mono text-sm"
                            placeholder="Nội dung bài viết..."
                            value={content} onChange={e => setContent(e.target.value)}
                        />
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded border">
                        <label className="block text-sm font-bold mb-2">Trạng thái</label>
                        <select 
                            className="w-full border p-2 rounded" 
                            value={status} onChange={e => setStatus(e.target.value)}
                        >
                            <option value={1}>Xuất bản (Hiện)</option>
                            <option value={2}>Chờ duyệt (Ẩn)</option>
                        </select>
                    </div>

                    <div className="bg-slate-50 p-4 rounded border">
                        <label className="block text-sm font-bold mb-2">Hình đại diện</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mb-2 text-sm" />
                        
                        <div className="h-40 w-full border-2 border-dashed border-slate-300 rounded flex items-center justify-center bg-white overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="Preview" className="h-full object-contain" />
                            ) : (
                                <span className="text-slate-400 text-xs">Chưa chọn ảnh</span>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 transition"
                    >
                        {loading ? 'Đang lưu...' : 'ĐĂNG BÀI VIẾT'}
                    </button>
                </div>
            </form>
        </div>
    );
}