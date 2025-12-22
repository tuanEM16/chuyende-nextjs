'use client';

import { useState, useEffect, useRef } from 'react'; // Thêm useRef để xử lý click ra ngoài
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductService from '@/services/ProductService';
import CategoryService from '@/services/CategoryService';
import AttributeService from '@/services/AttributeService';

// --- CẤU HÌNH ĐƯỜNG DẪN ẢNH DANH MỤC ---
const CATEGORY_IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/category/';

// --- ICONS ---
const SaveIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const UploadIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const PlusIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const ChevronDownIcon = ({ size = 16 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Data nguồn
    const [categories, setCategories] = useState([]); 
    const [attributesList, setAttributesList] = useState([]);

    // State cho Custom Dropdown Danh mục
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
    const catDropdownRef = useRef(null);

    // Form chính
    const [formData, setFormData] = useState({
        name: '', 
        category_id: '', 
        price: '',      
        description: '', 
        status: 1
    });

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [productAttributes, setProductAttributes] = useState([{ attribute_id: '', value: '' }]);

    useEffect(() => {
        const initData = async () => {
            try {
                const [catRes, attrRes] = await Promise.all([
                    CategoryService.index(),
                    AttributeService.index()
                ]);
                if (catRes.data?.success || Array.isArray(catRes.data)) setCategories(catRes.data.data || catRes.data);
                if (attrRes.data?.success || Array.isArray(attrRes.data)) setAttributesList(attrRes.data.data || attrRes.data);
            } catch (error) { console.error(error); }
        };
        initData();

        // Xử lý click outside để đóng dropdown
        const handleClickOutside = (event) => {
            if (catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
                setIsCatDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Helper lấy ảnh danh mục
    const getCatImageUrl = (filename) => {
        if (!filename) return "https://placehold.co/100x100?text=No+Img";
        if (filename.startsWith('http')) return filename;
        return CATEGORY_IMAGE_BASE_URL + filename;
    };

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // Xử lý chọn danh mục từ Custom Dropdown
    const handleSelectCategory = (catId) => {
        setFormData(prev => ({ ...prev, category_id: catId }));
        setIsCatDropdownOpen(false);
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };
    
    const removeGalleryImage = (index) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const addAttributeRow = () => setProductAttributes([...productAttributes, { attribute_id: '', value: '' }]);
    const removeAttributeRow = (index) => {
        const list = [...productAttributes];
        list.splice(index, 1);
        setProductAttributes(list);
    };
    const handleAttributeChange = (index, field, value) => {
        const list = [...productAttributes];
        list[index][field] = value;
        setProductAttributes(list);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price_buy', formData.price);       
            data.append('qty', 0); 
            data.append('description', formData.description); 
            data.append('content', formData.description); 
            data.append('status', formData.status);

            if (thumbnailFile) {
                data.append('thumbnail', thumbnailFile); 
            } else {
                alert("Vui lòng chọn ảnh đại diện!");
                setLoading(false);
                return;
            }

            galleryFiles.forEach((file) => {
                data.append('product_images[]', file);
            });

            const validAttributes = productAttributes.filter(a => a.attribute_id && a.value);
            data.append('attributes_json', JSON.stringify(validAttributes));

            await ProductService.store(data);

            if(confirm('Thêm sản phẩm thành công! Bạn có muốn nhập kho ngay không?')) {
                router.push('/admin/productstore'); 
            } else {
                router.push('/admin/product');
            }

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Lỗi server';
            alert('Lỗi: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    // Tìm danh mục đang chọn để hiển thị
    const selectedCategory = categories.find(c => c.id == formData.category_id);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Thêm Sản phẩm Mới</h1>
                <Link href="/admin/product" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- CỘT TRÁI --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">Thông tin chung</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none" placeholder="Nhập tên sản phẩm..." />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Giá bán <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg font-bold text-indigo-600 pl-4" placeholder="0" />
                                    <span className="absolute right-4 top-2 text-slate-400 text-sm">VNĐ</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 italic">
                                    * Tồn kho ban đầu sẽ là 0. Vui lòng vào mục "Quản lý kho" để nhập hàng sau khi tạo.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
                                <textarea name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="Mô tả sản phẩm..."></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Thuộc tính */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-bold text-slate-700">Thuộc tính sản phẩm</h2>
                            <button type="button" onClick={addAttributeRow} className="flex items-center space-x-1 text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100">
                                <PlusIcon size={16} /> <span>Thêm dòng</span>
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {productAttributes.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="w-1/3">
                                        <select 
                                            value={item.attribute_id}
                                            onChange={(e) => handleAttributeChange(index, 'attribute_id', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg bg-white"
                                        >
                                            <option value="">-- Chọn thuộc tính --</option>
                                            {attributesList.map(attr => (
                                                <option key={attr.id} value={attr.id}>{attr.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/2">
                                        <input 
                                            type="text" 
                                            value={item.value} 
                                            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            placeholder="Giá trị (VD: Đỏ, XL...)" 
                                        />
                                    </div>
                                    <button type="button" onClick={() => removeAttributeRow(index)} className="p-2 text-red-400 hover:text-red-600">
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI --- */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-4">
                        <h2 className="font-bold text-slate-700">Cài đặt</h2>
                        
                        {/* === CUSTOM DROPDOWN DANH MỤC CÓ ẢNH === */}
                        <div ref={catDropdownRef} className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            
                            {/* Nút Trigger Dropdown */}
                            <div 
                                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                                className="w-full px-4 py-2 border rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-indigo-400 transition"
                            >
                                <div className="flex items-center gap-3">
                                    {selectedCategory ? (
                                        <>
                                            <img 
                                                src={getCatImageUrl(selectedCategory.image)} 
                                                alt={selectedCategory.name}
                                                className="w-8 h-8 rounded object-cover border"
                                                onError={(e) => e.target.src = "https://placehold.co/100x100?text=IMG"}
                                            />
                                            <span className="font-medium text-slate-800">{selectedCategory.name}</span>
                                        </>
                                    ) : (
                                        <span className="text-slate-500">-- Chọn danh mục --</span>
                                    )}
                                </div>
                                <ChevronDownIcon className={`text-slate-400 transition-transform ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Danh sách Dropdown */}
                            {isCatDropdownOpen && (
                                <div className="absolute z-20 top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {categories.map((cat) => (
                                        <div 
                                            key={cat.id} 
                                            onClick={() => handleSelectCategory(cat.id)}
                                            className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition hover:bg-indigo-50 border-b last:border-0 ${formData.category_id == cat.id ? 'bg-indigo-50' : ''}`}
                                        >
                                            <img 
                                                src={getCatImageUrl(cat.image)} 
                                                alt={cat.name}
                                                className="w-10 h-10 rounded object-cover border bg-slate-100"
                                                onError={(e) => e.target.src = "https://placehold.co/100x100?text=IMG"}
                                            />
                                            <div>
                                                <p className="font-medium text-slate-800">{cat.name}</p>
                                                <p className="text-xs text-slate-400">ID: {cat.id}</p>
                                            </div>
                                            {formData.category_id == cat.id && (
                                                <span className="ml-auto text-indigo-600 font-bold">✓</span>
                                            )}
                                        </div>
                                    ))}
                                    {categories.length === 0 && (
                                        <div className="p-3 text-center text-slate-500">Không có danh mục nào</div>
                                    )}
                                </div>
                            )}

                            {/* Input ẩn để validate required (Trick) */}
                            <input 
                                type="text" 
                                name="category_id" 
                                required 
                                value={formData.category_id} 
                                onChange={() => {}} 
                                className="absolute opacity-0 bottom-0 left-0 h-0 w-full" 
                                onInvalid={(e) => e.target.setCustomValidity('Vui lòng chọn danh mục')}
                                onInput={(e) => e.target.setCustomValidity('')}
                            />
                        </div>
                        {/* === HẾT CUSTOM DROPDOWN === */}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                                <option value="1">Xuất bản</option>
                                <option value="2">Nháp</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ảnh đại diện <span className="text-red-500">*</span></label>
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 relative overflow-hidden">
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadIcon className="text-slate-400 mb-2" />
                                    <p className="text-xs text-slate-500">Click tải ảnh đại diện</p>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                        </label>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Thư viện ảnh</label>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            {galleryPreviews.map((src, idx) => (
                                <div key={idx} className="relative h-20 border rounded overflow-hidden group">
                                    <img src={src} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5"><TrashIcon size={12}/></button>
                                </div>
                            ))}
                            <label className="h-20 border-2 border-dashed border-slate-300 rounded flex items-center justify-center cursor-pointer hover:bg-slate-50">
                                <PlusIcon className="text-slate-400" />
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryChange} />
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-bold shadow-md">
                        {loading ? <span>Đang lưu...</span> : <><SaveIcon /><span>Lưu sản phẩm</span></>}
                    </button>
                </div>
            </form>
        </div>
    );
}