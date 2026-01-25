'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import PostService from '@/services/PostService';


const SaveIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

export default function EditPost({ params: paramsPromise }) {

    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState(''); // QUAN TRỌNG: Dùng 'content'
    const [status, setStatus] = useState(1);
    const [image, setImage] = useState(null);       // File ảnh mới (nếu chọn)
    const [preview, setPreview] = useState(null);   // URL ảnh preview


    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                console.log("Đang lấy dữ liệu bài viết ID:", id);
                const res = await PostService.show(id);
                console.log("Kết quả API:", res);


                const data = res.data?.data || res.data;

                if (data) {
                    setTitle(data.title || '');
                    setDescription(data.description || '');

                    setContent(data.content || ''); 
                    setStatus(data.status ?? 1);
                    

                    if (data.image) {
                        setPreview(PostService.getImageUrl(data.image));
                    }
                } else {
                    alert("Không tìm thấy dữ liệu bài viết!");
                }
            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
                alert("Có lỗi khi tải thông tin bài viết.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);


        const formData = new FormData();
        formData.append('_method', 'PUT'); // Bắt buộc đối với Laravel khi upload ảnh lúc update
        formData.append('title', title);
        formData.append('description', description);
        formData.append('content', content); // Gửi key 'content'
        formData.append('status', status);
        

        if (image) {
            formData.append('image', image);
        }

        try {
            await PostService.update(id, formData);
            alert("Cập nhật thành công!");
            router.push('/admin/post');
        } catch (error) {
            console.error(error);
            alert("Lỗi khi cập nhật: " + (error.response?.data?.message || error.message));
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Đang tải dữ liệu cũ...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-2 bg-white border rounded hover:bg-slate-50">
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">Cập nhật Bài viết</h1>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CỘT TRÁI: Nội dung chính */}
                <div className="lg:col-span-2 space-y-5">
                    
                    {/* Tiêu đề */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            required 
                            className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            placeholder="Nhập tiêu đề bài viết..."
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Mô tả ngắn */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả ngắn</label>
                        <textarea 
                            rows="3"
                            className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            placeholder="Tóm tắt nội dung..."
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Nội dung chi tiết (CONTENT) */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nội dung chi tiết <span className="text-red-500">*</span></label>
                        <textarea 
                            rows="15" 
                            required
                            className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 font-mono text-sm"
                            placeholder="Nhập nội dung đầy đủ..."
                            value={content} 
                            onChange={e => setContent(e.target.value)}
                        />
                        <p className="text-xs text-slate-400 mt-1 text-right">Hỗ trợ HTML cơ bản</p>
                    </div>
                </div>

                {/* CỘT PHẢI: Cấu hình & Ảnh */}
                <div className="space-y-6">
                    
                    {/* Trạng thái */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái</label>
                        <select 
                            className="w-full border border-slate-300 p-2.5 rounded-lg bg-white" 
                            value={status} 
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value={1}>Xuất bản (Hiện)</option>
                            <option value={2}>Bản nháp (Ẩn)</option>
                        </select>
                    </div>

                    {/* Hình ảnh */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Hình đại diện</label>
                        
                        {/* Khu vực Preview */}
                        <div className="aspect-video w-full bg-white border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden mb-3 relative group">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-slate-400">
                                    <p className="text-xs">Chưa có ảnh</p>
                                </div>
                            )}
                            
                            {/* Overlay khi hover để nhắc chọn ảnh */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <p className="text-white text-xs font-bold">Bấm bên dưới để thay đổi</p>
                            </div>
                        </div>

                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                        />
                        <p className="text-[10px] text-slate-400 mt-2 italic">Chỉ chọn nếu muốn thay ảnh mới</p>
                    </div>

                    {/* Nút Submit */}
                    <button 
                        type="submit" 
                        disabled={processing}
                        className={`w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {processing ? 'Đang lưu...' : <><SaveIcon /> CẬP NHẬT BÀI VIẾT</>}
                    </button>
                </div>
            </form>
        </div>
    );
}