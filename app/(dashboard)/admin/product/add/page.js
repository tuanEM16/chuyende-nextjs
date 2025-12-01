'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Để chuyển trang
import axios from 'axios'; // Cần cài npm install axios

// --- INLINE SVG ---
const SaveIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);
const ArrowLeftIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
// --- END ICONS ---

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // State dữ liệu text
    const [formData, setFormData] = useState({
        name: '',
        category_id: '', // Backend cần ID
        price: '',
        stock: '',
        description: '',
    });

    // State riêng cho file ảnh
    const [thumbnail, setThumbnail] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Xử lý thay đổi input text
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý thay đổi input file ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file)); // Tạo link xem trước
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Chuẩn bị FormData (Bắt buộc để gửi file)
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price_buy', formData.price); // Map 'price' form -> 'price_buy' backend
            data.append('description', formData.description);
            data.append('content', formData.description); // Tạm thời dùng description cho content
            data.append('status', 1); // Mặc định hiển thị
            
            // Nếu có stock, gửi qty (Nếu controller hỗ trợ)
            if(formData.stock) data.append('qty', formData.stock);

            // Gửi file ảnh
            if (thumbnail) {
                data.append('thumbnail', thumbnail);
            }

            // 2. Gọi API Laravel
            // Lưu ý: Đảm bảo Laravel đang chạy ở port 8000
            const res = await axios.post('http://127.0.0.1:8000/api/product', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                alert('Thêm sản phẩm thành công!');
                router.push('/admin/product'); // Chuyển hướng về trang danh sách (sửa link này đúng với route của bạn)
            }

        } catch (error) {
            console.error('Lỗi API:', error);
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể kết nối đến server'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Thêm Sản phẩm mới</h1>
                {/* Sửa lại href về đúng trang danh sách của bạn */}
                <Link href="/admin/product" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tên sản phẩm */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tên sản phẩm</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="Nhập tên sản phẩm..."
                        />
                    </div>

                    {/* Danh mục */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục</label>
                        <select
                            name="category_id"
                            required
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        >
                            <option value="">Chọn danh mục</option>
                            {/* Value ở đây phải là ID (số) khớp với database */}
                            <option value="1">Gạch Lát Nền (ID: 1)</option>
                            <option value="2">Gạch Ốp Tường (ID: 2)</option>
                            <option value="3">Thiết bị vệ sinh (ID: 3)</option>
                            <option value="4">Sàn gỗ (ID: 4)</option>
                        </select>
                    </div>

                    {/* Giá */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Giá (VNĐ)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="0"
                        />
                    </div>

                    {/* Tồn kho */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Số lượng tồn kho</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Upload Hình ảnh - ĐÃ SỬA */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh sản phẩm</label>
                    <div className="flex items-start space-x-4">
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                            />
                            <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF lên đến 2MB</p>
                        </div>
                        {/* Xem trước ảnh */}
                        {previewUrl && (
                            <div className="w-24 h-24 border rounded-lg overflow-hidden bg-slate-100">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả sản phẩm</label>
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        placeholder="Mô tả chi tiết về sản phẩm..."
                    ></textarea>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t">
                    <Link href="/admin/product">
                        <button
                            type="button"
                            className="mr-4 px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition font-medium"
                        >
                            Hủy bỏ
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span>Đang xử lý...</span>
                        ) : (
                            <>
                                <SaveIcon />
                                <span>Lưu sản phẩm</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}