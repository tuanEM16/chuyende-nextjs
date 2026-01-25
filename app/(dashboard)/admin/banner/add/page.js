'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BannerService from '@/services/BannerService';

export default function AddBanner() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    

    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [position, setPosition] = useState('slideshow');
    const [description, setDescription] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
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
            await BannerService.store(formData);
            alert("Thêm banner thành công!");
            router.push('/admin/banner');
        } catch (error) {
            console.error(error);
            alert("Lỗi khi thêm banner.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Thêm Banner Quảng cáo</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Cột trái */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Tên Banner <span className="text-red-500">*</span></label>
                        <input type="text" required className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Khuyến mãi mùa hè" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Đường dẫn (Link)</label>
                        <input type="text" className="w-full border p-2 rounded" value={link} onChange={e => setLink(e.target.value)} placeholder="http://..." />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Vị trí</label>
                        <select className="w-full border p-2 rounded" value={position} onChange={e => setPosition(e.target.value)}>
                            <option value="slideshow">Slideshow (Trang chủ)</option>
                            <option value="ads">Quảng cáo nhỏ</option>
                            <option value="sidebar">Thanh bên</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Mô tả</label>
                        <textarea rows="3" className="w-full border p-2 rounded" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </div>

                {/* Cột phải */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Sắp xếp</label>
                        <input type="number" className="w-full border p-2 rounded" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Trạng thái</label>
                        <select className="w-full border p-2 rounded" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value={1}>Hiện</option>
                            <option value={2}>Ẩn</option>
                        </select>
                    </div>

                    <div className="bg-slate-50 p-4 rounded border">
                        <label className="block text-sm font-bold mb-2">Hình ảnh</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mb-2" />
                        
                        <div className="h-40 w-full border-2 border-dashed border-slate-300 rounded flex items-center justify-center bg-white overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="Preview" className="h-full object-contain" />
                            ) : (
                                <span className="text-slate-400 text-xs">Chưa chọn ảnh</span>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 transition">
                        {loading ? 'Đang lưu...' : 'LƯU BANNER'}
                    </button>
                </div>
            </form>
        </div>
    );
}