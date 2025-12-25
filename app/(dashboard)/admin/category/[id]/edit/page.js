'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CategoryService from '@/services/CategoryService';

// --- ICONS ---
const SaveIcon = ({ size = 20 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>);
const ArrowLeftIcon = ({ size = 20 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>);
const UploadIcon = ({ size = 20 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>);
const ChevronDownIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>);

export default function EditCategoryPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    // Data
    const [categories, setCategories] = useState([]);
    
    // Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Form Data (Đã thêm slug)
    const [formData, setFormData] = useState({
        name: '',
        slug: '', // <--- ĐÃ THÊM LẠI SLUG
        parent_id: 0,
        sort_order: 0,
        description: '',
        status: 1
    });

    const [imageFile, setImageFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [detailRes, listRes] = await Promise.all([
                    CategoryService.show(id),
                    CategoryService.index()
                ]);

                // 1. Xử lý danh sách cha
                if (listRes.data?.success || Array.isArray(listRes.data)) {
                    const allCats = listRes.data.data || listRes.data || [];
                    setCategories(allCats.filter(cat => String(cat.id) !== String(id)));
                }

                // 2. Điền dữ liệu vào form
                const cat = detailRes.data?.data || detailRes.data;
                if (cat) {
                    setFormData({
                        name: cat.name || '',
                        slug: cat.slug || '', // <--- Lấy slug từ DB
                        parent_id: cat.parent_id || 0,
                        sort_order: cat.sort_order || 0,
                        description: cat.description || '',
                        status: cat.status ?? 1
                    });

                    if (cat.image) {
                        setCurrentImageUrl(CategoryService.getImageUrl(cat.image));
                    }
                }

            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
                alert('Không thể tải thông tin danh mục!');
            } finally {
                setFetching(false);
            }
        };

        fetchData();

        // Click outside dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectParent = (catId) => {
        setFormData(prev => ({ ...prev, parent_id: catId }));
        setIsDropdownOpen(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('slug', formData.slug); // <--- Gửi slug lên Server
            data.append('parent_id', formData.parent_id);
            data.append('sort_order', formData.sort_order);
            data.append('description', formData.description);
            data.append('status', formData.status);
            data.append('_method', 'PUT'); 

            if (imageFile) {
                data.append('image', imageFile);
            }

            const res = await CategoryService.update(id, data);

            if (res.data?.success) {
                alert('Cập nhật danh mục thành công!');
                router.push('/admin/category');
            } else {
                alert('Cập nhật thất bại: ' + (res.message || 'Lỗi không xác định'));
            }

        } catch (error) {
            console.error('Lỗi API:', error);
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể cập nhật'));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center py-10 text-slate-500 animate-pulse">Đang tải dữ liệu...</div>;

    const selectedParent = categories.find(c => c.id == formData.parent_id);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Chỉnh sửa Danh mục</h1>
                <Link href="/admin/category" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* --- CỘT TRÁI: THÔNG TIN CHÍNH --- */}
                <div className="md:col-span-2 space-y-6 bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tên danh mục</label>
                        <input
                            type="text" name="name" required value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none transition"
                        />
                    </div>

                    {/* --- ĐÃ THÊM LẠI Ô NHẬP SLUG --- */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Slug (Đường dẫn)</label>
                        <input
                            type="text" name="slug" required value={formData.slug} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả</label>
                        <textarea
                            name="description" rows="4" value={formData.description} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none transition"
                        ></textarea>
                    </div>
                </div>

                {/* --- CỘT PHẢI: CẤU HÌNH & ẢNH --- */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-4">
                        <h2 className="font-bold text-slate-700">Cài đặt</h2>

                        {/* CUSTOM DROPDOWN DANH MỤC CHA */}
                        <div ref={dropdownRef} className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục cha</label>
                            
                            {/* Nút Trigger */}
                            <div 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-indigo-400 transition"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {formData.parent_id == 0 ? (
                                        <span className="text-slate-500 italic">-- Không có (Danh mục gốc) --</span>
                                    ) : selectedParent ? (
                                        <>
                                            <img 
                                                src={CategoryService.getImageUrl(selectedParent.image)} 
                                                alt={selectedParent.name}
                                                className="w-6 h-6 rounded object-cover border shrink-0"
                                                onError={CategoryService.handleImageError}
                                            />
                                            <span className="font-medium text-slate-800 truncate">{selectedParent.name}</span>
                                        </>
                                    ) : (
                                        <span className="text-slate-500">Chọn danh mục cha...</span>
                                    )}
                                </div>
                                <ChevronDownIcon className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Dropdown List */}
                            {isDropdownOpen && (
                                <div className="absolute z-20 top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    <div 
                                        onClick={() => handleSelectParent(0)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 border-b text-slate-500 italic ${formData.parent_id == 0 ? 'bg-indigo-50 font-bold' : ''}`}
                                    >
                                        -- Không có (Danh mục gốc) --
                                    </div>
                                    {categories.map((cat) => (
                                        <div 
                                            key={cat.id} 
                                            onClick={() => handleSelectParent(cat.id)}
                                            className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition hover:bg-indigo-50 border-b last:border-0 ${formData.parent_id == cat.id ? 'bg-indigo-50' : ''}`}
                                        >
                                            <img 
                                                src={CategoryService.getImageUrl(cat.image)} 
                                                alt={cat.name}
                                                className="w-8 h-8 rounded object-cover border bg-slate-100 shrink-0"
                                                onError={CategoryService.handleImageError}
                                            />
                                            <div className="overflow-hidden">
                                                <p className="font-medium text-slate-800 truncate">{cat.name}</p>
                                                <p className="text-xs text-slate-400">ID: {cat.id}</p>
                                            </div>
                                            {formData.parent_id == cat.id && <span className="ml-auto text-indigo-600 font-bold">✓</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* END CUSTOM DROPDOWN */}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Thứ tự</label>
                            <input
                                type="number" name="sort_order" value={formData.sort_order} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                            <select
                                name="status" value={formData.status} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none"
                            >
                                <option value="1">Hiển thị</option>
                                <option value="2">Ẩn</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh danh mục</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition relative overflow-hidden">
                                {previewUrl ? (
                                    <div className="relative w-full h-full">
                                        <img src={previewUrl} alt="New" className="w-full h-full object-contain p-2" />
                                        <span className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1">Mới</span>
                                    </div>
                                ) : currentImageUrl ? (
                                    <div className="relative w-full h-full">
                                        <img src={currentImageUrl} alt="Current" className="w-full h-full object-contain p-2" onError={CategoryService.handleImageError} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadIcon className="text-slate-400 mb-2" />
                                        <p className="text-xs text-slate-500">Click để thay ảnh</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Link href="/admin/category" className="mr-4">
                            <button type="button" className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition font-medium">Hủy bỏ</button>
                        </Link>
                        <button
                            type="submit" disabled={loading}
                            className={`flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? <span>Đang lưu...</span> : <><SaveIcon /><span>Cập nhật</span></>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}