'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import CategoryService from '@/services/CategoryService';


const ArrowLeftIcon = ({ size = 20 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>);
const SaveIcon = ({ size = 20 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>);
const UploadIcon = ({ size = 20 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>);
const ChevronDownIcon = ({ size = 16 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>);

export default function AddCategoryPage() {
    const router = useRouter();
    

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState(0);
    const [sortOrder, setSortOrder] = useState(1);
    const [status, setStatus] = useState(1);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);


    const [categories, setCategories] = useState([]);


    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await CategoryService.index();
                if (res.data?.success || Array.isArray(res.data)) {
                    setCategories(res.data.data || res.data || []);
                }
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        })();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const generateSlug = (value) => {
        return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setSlug(generateSlug(value));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSelectParent = (id) => {
        setParentId(id);
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        formData.append('description', description);
        formData.append('parent_id', parentId);
        formData.append('sort_order', sortOrder);
        formData.append('status', status);
        if (image) formData.append('image', image);

        try {
            await CategoryService.store(formData);
            alert('Thêm danh mục thành công!');
            router.push('/admin/category'); 
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    const selectedParent = categories.find(c => c.id == parentId);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Thêm Danh mục</h1>
                <Link href="/admin/category" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- CỘT TRÁI --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 space-y-4">
                        <h2 className="font-bold text-slate-700 border-b pb-2">Thông tin chung</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tên danh mục <span className="text-red-500">*</span></label>
                            <input
                                type="text" required value={name} onChange={handleNameChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none"
                                placeholder="Ví dụ: Thời trang Nam"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
                            <input
                                type="text" required value={slug} onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả</label>
                            <textarea
                                rows="4" value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none"
                                placeholder="Mô tả ngắn..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI --- */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-4">
                        <h2 className="font-bold text-slate-700">Cài đặt</h2>
                        
                        {/* CUSTOM DROPDOWN */}
                        <div ref={dropdownRef} className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục cha</label>
                            <div 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-indigo-400 transition"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {parentId == 0 ? (
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

                            {isDropdownOpen && (
                                <div className="absolute z-20 top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    <div 
                                        onClick={() => handleSelectParent(0)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 border-b text-slate-500 italic ${parentId == 0 ? 'bg-indigo-50 font-bold' : ''}`}
                                    >
                                        -- Không có (Danh mục gốc) --
                                    </div>
                                    {categories.map((cat) => (
                                        <div 
                                            key={cat.id} 
                                            onClick={() => handleSelectParent(cat.id)}
                                            className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition hover:bg-indigo-50 border-b last:border-0 ${parentId == cat.id ? 'bg-indigo-50' : ''}`}
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
                                            {parentId == cat.id && <span className="ml-auto text-indigo-600 font-bold">✓</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Thứ tự sắp xếp</label>
                            <input
                                type="number" min="1" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
                            >
                                <option value="1">Xuất bản (Hiện)</option>
                                <option value="2">Nháp (Ẩn)</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition relative overflow-hidden">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadIcon className="text-slate-400 mb-2" />
                                        <p className="text-xs text-slate-500">Click để tải ảnh</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium shadow-md">
                        <SaveIcon />
                        <span>Lưu Danh mục</span>
                    </button>
                </div>
            </form>
        </div>
    );
}