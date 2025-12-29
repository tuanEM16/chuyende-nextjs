'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductImageService from '@/services/ProductImageService';

// --- ICONS ---
const SaveIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const ImageIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;

export default function EditProductImageBulkPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const currentId = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Thông tin sản phẩm chung
    const [productInfo, setProductInfo] = useState({
        id: null,
        name: 'Đang tải...',
    });

    // Danh sách ảnh của sản phẩm này
    const [galleryItems, setGalleryItems] = useState([]);

    useEffect(() => {
        if (!currentId) return;

        const initData = async () => {
            try {
                setFetching(true);
                
                // 1. Lấy thông tin ảnh hiện tại
                const currentRes = await ProductImageService.show(currentId);
                const currentData = currentRes.data?.data || currentRes.data;

                if (!currentData) throw new Error("Không tìm thấy hình ảnh.");

                // Cập nhật thông tin sản phẩm
                setProductInfo({
                    id: currentData.product_id,
                    name: currentData.product?.name || `Sản phẩm #${currentData.product_id}`
                });

                // 2. Lấy tất cả ảnh để lọc ra các ảnh cùng sản phẩm
                const allRes = await ProductImageService.index();
                const allImages = allRes.data?.data || allRes.data || [];

                // 3. Lọc ảnh cùng product_id
                const siblings = allImages.filter(item => String(item.product_id) === String(currentData.product_id));
                
                // Map dữ liệu để xử lý trên form
                const mappedItems = siblings.map(item => ({
                    id: item.id,
                    image_url: ProductImageService.getImageUrl(item.image), // Url hiển thị
                    file: null, // File mới nếu người dùng chọn thay thế
                    alt: item.alt || '',
                    title: item.title || '',
                    is_deleted: false,
                    is_changed: false // Cờ đánh dấu đã sửa để chỉ update cái cần thiết
                }));

                setGalleryItems(mappedItems);

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                alert("Có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setFetching(false);
            }
        };

        initData();
    }, [currentId]);

    // Handle thay đổi text (Alt/Title)
    const handleTextChange = (index, field, value) => {
        const newItems = [...galleryItems];
        newItems[index][field] = value;
        newItems[index].is_changed = true;
        setGalleryItems(newItems);
    };

    // Handle chọn file mới thay thế
    const handleFileChange = (index, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newItems = [...galleryItems];
            newItems[index].file = file;
            newItems[index].image_url = URL.createObjectURL(file); // Preview ảnh mới
            newItems[index].is_changed = true;
            setGalleryItems(newItems);
        }
    };

    // Handle xóa ảnh
    const handleRemoveItem = (index) => {
        if(confirm("Bạn muốn xóa ảnh này vĩnh viễn?")) {
            const newItems = [...galleryItems];
            newItems[index].is_deleted = true;
            setGalleryItems(newItems);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const itemsToUpdate = galleryItems.filter(item => !item.is_deleted && item.is_changed);
            const itemsToDelete = galleryItems.filter(item => item.is_deleted);

            if (itemsToUpdate.length === 0 && itemsToDelete.length === 0) {
                alert("Bạn chưa thay đổi thông tin nào.");
                setLoading(false);
                return;
            }

            // 1. Update các item có thay đổi
            const updatePromises = itemsToUpdate.map(item => {
                const formData = new FormData();
                formData.append('alt', item.alt);
                formData.append('title', item.title);
                if (item.file) {
                    formData.append('image', item.file);
                }
                // Laravel cần _method=PUT khi dùng FormData
                formData.append('_method', 'PUT'); 

                return ProductImageService.update(item.id, formData);
            });

            // 2. Delete các item bị xóa
            const deletePromises = itemsToDelete.map(item => {
                return ProductImageService.destroy(item.id);
            });

            await Promise.all([...updatePromises, ...deletePromises]);

            alert(`Đã cập nhật ${itemsToUpdate.length} ảnh và xóa ${itemsToDelete.length} ảnh.`);
            router.push('/admin/productimage');

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra: " + (error.message || "Lỗi server"));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center py-20 text-slate-500 animate-pulse">Đang tải thư viện ảnh...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-800">Quản lý Ảnh Sản phẩm</h1>
                <Link href="/admin/productimage" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon /> <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* --- CỘT TRÁI: THÔNG TIN SẢN PHẨM --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
                        <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold border-b pb-2">
                            <ImageIcon /> THÔNG TIN SẢN PHẨM
                        </div>
                        
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-slate-500">Tên sản phẩm:</p>
                                <p className="font-bold text-slate-800 text-base">{productInfo.name}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Mã sản phẩm:</p>
                                <p className="font-mono text-slate-700">#{productInfo.id}</p>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-slate-500">Tổng số ảnh:</p>
                                <p className="text-2xl font-bold text-indigo-600">
                                    {galleryItems.filter(i => !i.is_deleted).length}
                                </p>
                            </div>
                            
                            <div className="bg-indigo-50 p-3 text-xs text-indigo-800 rounded border border-indigo-100 mt-4">
                                ℹ️ Bạn đang sửa toàn bộ ảnh thuộc sản phẩm này. Hãy nhập Alt Text và Title để tối ưu SEO.
                            </div>
                        </div>

                        <div className="mt-6">
                            <button 
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow hover:bg-indigo-700 transition flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Đang lưu...' : <><SaveIcon /> LƯU THAY ĐỔI</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI: DANH SÁCH ẢNH --- */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800">Danh sách hình ảnh</h2>
                        </div>

                        <div className="p-6 space-y-6">
                            {galleryItems.map((item, index) => {
                                if (item.is_deleted) return null;

                                return (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 border rounded-xl hover:shadow-md transition bg-white group">
                                        {/* Phần ảnh Preview & Upload */}
                                        <div className="w-full sm:w-40 flex flex-col gap-2">
                                            <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border relative group/img">
                                                <img 
                                                    src={item.image_url} 
                                                    className="w-full h-full object-contain"
                                                    alt="Preview"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">Thay ảnh</span>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    title="Bấm để thay đổi hình ảnh này"
                                                    onChange={(e) => handleFileChange(index, e)}
                                                />
                                            </div>
                                            <div className="text-center">
                                                <span className="text-xs text-slate-400">ID: {item.id}</span>
                                            </div>
                                        </div>

                                        {/* Phần nhập liệu */}
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alt Text (SEO)</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 outline-none transition"
                                                        placeholder="Mô tả ảnh cho Google..."
                                                        value={item.alt}
                                                        onChange={(e) => handleTextChange(index, 'alt', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tiêu đề (Title)</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 outline-none transition"
                                                        placeholder="Tiêu đề hiển thị khi hover..."
                                                        value={item.title}
                                                        onChange={(e) => handleTextChange(index, 'title', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Trạng thái thay đổi */}
                                            {item.is_changed && (
                                                <div className="text-xs text-orange-500 font-bold italic flex items-center gap-1">
                                                    * Có thay đổi chưa lưu
                                                </div>
                                            )}

                                            {/* Nút xóa */}
                                            <div className="pt-2 flex justify-end">
                                                <button 
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition text-sm font-medium"
                                                >
                                                    <TrashIcon /> Xóa ảnh này
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {galleryItems.filter(i => !i.is_deleted).length === 0 && (
                                <div className="text-center py-10 text-slate-400 italic border-2 border-dashed rounded-xl">
                                    Không còn ảnh nào.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}