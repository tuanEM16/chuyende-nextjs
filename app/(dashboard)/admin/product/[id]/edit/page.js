'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

// --- ICONS ---
const SaveIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
// --- END ICONS ---

export default function EditProductPage() {
    const params = useParams(); // Lấy ID từ URL
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState([]); // State danh sách danh mục

    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/product/';

    // State dữ liệu form
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '', 
        stock: '', 
        description: '',
        status: 1
    });

    const [thumbnail, setThumbnail] = useState(null); 
    const [currentImageUrl, setCurrentImageUrl] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(null); 

    // Load dữ liệu khi vào trang
    useEffect(() => {
        const fetchData = async () => {
            if (!params?.id) return;

            try {
                // Gọi song song 2 API: Lấy chi tiết sản phẩm & Lấy danh sách danh mục
                const [productRes, categoryRes] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/api/product/${params.id}`),
                    axios.get('http://127.0.0.1:8000/api/category')
                ]);

                // 1. Xử lý danh mục (để đổ vào Select)
                if (categoryRes.data.success) {
                    setCategories(categoryRes.data.data || []);
                }

                // 2. Xử lý sản phẩm (để điền vào Form)
                if (productRes.data.success) {
                    const product = productRes.data.data;
                    
                    setFormData({
                        name: product.name,
                        category_id: product.category_id,
                        price: product.price_buy, 
                        description: product.description || '',
                        status: product.status,
                        stock: product.qty || 0 
                    });

                    // Xử lý ảnh cũ
                    if (product.thumbnail) {
                        const imgUrl = product.thumbnail.startsWith('http') 
                            ? product.thumbnail 
                            : IMAGE_BASE_URL + product.thumbnail;
                        setCurrentImageUrl(imgUrl);
                    }
                }
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
                alert('Không thể tải dữ liệu sản phẩm hoặc danh mục!');
                // router.push('/admin/product'); // Uncomment nếu muốn quay về khi lỗi
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price_buy', formData.price);
            data.append('description', formData.description);
            data.append('content', formData.description); 
            data.append('status', formData.status);
            
            // QUAN TRỌNG: Gửi _method=PUT để Laravel hiểu
            data.append('_method', 'PUT');

            if (thumbnail) {
                data.append('thumbnail', thumbnail);
            }

            const res = await axios.post(`http://127.0.0.1:8000/api/product/${params.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert('Cập nhật sản phẩm thành công!');
                router.push('/admin/product');
            }

        } catch (error) {
            console.error('Lỗi API:', error);
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể cập nhật'));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="text-center py-10 text-slate-500 animate-pulse">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Chỉnh sửa Sản phẩm</h1>
                <Link href="/admin/product" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-slate-200">
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
                        />
                    </div>

                    {/* Danh mục (Đã load động từ API) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục</label>
                        <select
                            name="category_id"
                            required
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
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
                        />
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        >
                            <option value="1">Hiển thị</option>
                            <option value="0">Ẩn</option>
                        </select>
                    </div>
                </div>

                {/* Phần Hình ảnh */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh sản phẩm</label>
                    <div className="flex items-start space-x-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        {/* Ảnh hiện tại */}
                        {!previewUrl && currentImageUrl && (
                            <div className="text-center">
                                <p className="text-xs text-slate-500 mb-2">Ảnh hiện tại</p>
                                <div className="w-24 h-24 border rounded-lg overflow-hidden bg-white shadow-sm">
                                    <img src={currentImageUrl} alt="Current" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}

                        {/* Ảnh mới chọn */}
                        {previewUrl && (
                            <div className="text-center">
                                <p className="text-xs text-green-600 mb-2 font-medium">Ảnh mới</p>
                                <div className="w-24 h-24 border-2 border-green-500 rounded-lg overflow-hidden bg-white shadow-sm">
                                    <img src={previewUrl} alt="New" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}

                        {/* Input chọn file */}
                        <div className="flex-1 mt-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100 cursor-pointer"
                            />
                            <p className="mt-2 text-xs text-slate-500">Chọn ảnh mới để thay thế (PNG, JPG, GIF)</p>
                        </div>
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
                    ></textarea>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t">
                    <Link href="/admin/product" className="mr-4">
                        <button type="button" className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition font-medium">
                            Hủy bỏ
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span>Đang cập nhật...</span>
                        ) : (
                            <>
                                <SaveIcon />
                                <span>Cập nhật</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}