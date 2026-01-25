'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import BannerService from '@/services/BannerService';


const SaveIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

export default function EditBanner({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);


    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [position, setPosition] = useState('slideshow');
    const [description, setDescription] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [status, setStatus] = useState(1);
    
    const [image, setImage] = useState(null);       // File mới
    const [preview, setPreview] = useState(null);   // URL ảnh preview


    useEffect(() => {
        if(!id) return;

        const fetchData = async () => {
            try {

                const res = await BannerService.show(id);
                const data = res.data?.data || res.data;
                
                if(data) {

                    setName(data.name || '');
                    setLink(data.link || '');
                    setPosition(data.position || 'slideshow');
                    setDescription(data.description || '');
                    setSortOrder(data.sort_order || 0);
                    setStatus(data.status ?? 1);
                    

                    if (data.image) {
                        setPreview(BannerService.getImageUrl(data.image));
                    }
                } else {
                    alert("Không tìm thấy dữ liệu banner!");
                }
            } catch (error) {
                console.error("Lỗi tải banner:", error);
                alert("Lỗi kết nối khi tải dữ liệu.");
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
        formData.append('_method', 'PUT'); // Bắt buộc để Laravel nhận file khi update
        formData.append('name', name);
        formData.append('link', link);
        formData.append('position', position);
        formData.append('description', description);
        formData.append('sort_order', sortOrder);
        formData.append('status', status);
        
        if (image) {
            formData.append('image', image);
        }

        try {
            await BannerService.update(id, formData);
            alert("Cập nhật thành công!");
            router.push('/admin/banner');
        } catch (error) {
            console.error(error);
            alert("Lỗi cập nhật: " + (error.response?.data?.message || "Lỗi server"));
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Đang tải dữ liệu cũ...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => router.back()} className="p-2 bg-white border rounded hover:bg-slate-50">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">Cập nhật Banner</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Cột trái */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tên Banner <span className="text-red-500">*</span></label>
                        <input type="text" required className="w-full border p-2.5 rounded-lg outline-none focus:border-indigo-500" 
                            value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Đường dẫn (Link)</label>
                        <input type="text" className="w-full border p-2.5 rounded-lg outline-none focus:border-indigo-500" 
                            value={link} onChange={e => setLink(e.target.value)} placeholder="http://..." />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Vị trí hiển thị</label>
                        <select className="w-full border p-2.5 rounded-lg bg-white" 
                            value={position} onChange={e => setPosition(e.target.value)}>
                            <option value="slideshow">Slideshow (Trang chủ)</option>
                            <option value="ads">Quảng cáo nhỏ</option>
                            <option value="sidebar">Thanh bên</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả</label>
                        <textarea rows="3" className="w-full border p-2.5 rounded-lg outline-none focus:border-indigo-500" 
                            value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </div>

                {/* Cột phải */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Thứ tự sắp xếp</label>
                        <input type="number" className="w-full border p-2.5 rounded-lg outline-none focus:border-indigo-500" 
                            value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Trạng thái</label>
                        <select className="w-full border p-2.5 rounded-lg bg-white" 
                            value={status} onChange={e => setStatus(e.target.value)}>
                            <option value={1}>Hiện (Active)</option>
                            <option value={2}>Ẩn (Hidden)</option>
                        </select>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Hình ảnh</label>
                        
                        {/* Preview Ảnh */}
                        <div className="aspect-video w-full bg-white border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden mb-3 relative group">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-slate-400 text-xs">Chưa có ảnh</span>
                            )}
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                                <p className="text-white text-xs font-bold">Ảnh hiện tại</p>
                            </div>
                        </div>

                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
                        <p className="text-[10px] text-slate-400 mt-2 italic">Chọn ảnh mới để thay thế ảnh cũ.</p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing} 
                        className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow hover:bg-indigo-700 transition flex items-center justify-center gap-2 ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {processing ? 'Đang lưu...' : <><SaveIcon /> CẬP NHẬT BANNER</>}
                    </button>
                </div>
            </form>
        </div>
    );
}