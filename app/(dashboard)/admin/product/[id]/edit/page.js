'use client';

import { useState, useEffect, useRef, use } from 'react'; // Thêm useRef
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductService from '@/services/ProductService';
import CategoryService from '@/services/CategoryService';
import AttributeService from '@/services/AttributeService';

// --- CẤU HÌNH ẢNH DANH MỤC ---
const CATEGORY_IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/category/';

// --- ICONS ---
const SaveIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const UploadIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const TrashIcon = ({ size = 16 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const PlusIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ChevronDownIcon = ({ size = 16 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;

export default function EditProductPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [attributesList, setAttributesList] = useState([]);
    
    // State cho Custom Dropdown
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
    const catDropdownRef = useRef(null);

    // Thumbnail states
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Gallery states
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [oldGallery, setOldGallery] = useState([]);

    // Attribute State
    const [productAttributes, setProductAttributes] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        stock: '0',
        description: '',
        status: 1
    });

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [catRes, attrRes, prodRes] = await Promise.all([
                    CategoryService.index(),
                    AttributeService.index(),
                    ProductService.show(id)
                ]);

                // 1. Categories & Attributes
                if (catRes.data) setCategories(catRes.data.data || catRes.data);
                if (attrRes.data) setAttributesList(attrRes.data.data || attrRes.data);

                // 2. Product Data
                const productData = prodRes.data && prodRes.data.success ? prodRes.data.data : (prodRes.data || prodRes);

                if (productData) {
                    setFormData({
                        name: productData.name,
                        category_id: productData.category_id,
                        price: productData.price_buy,
                        stock: productData.qty || 0,
                        description: productData.description || '',
                        status: productData.status
                    });

                    if (productData.thumbnail) setCurrentImageUrl(ProductService.getImageUrl(productData.thumbnail));
                    if (productData.product_images) setOldGallery(productData.product_images);
                    
                    // Attributes
                    if (productData.product_attributes && productData.product_attributes.length > 0) {
                        setProductAttributes(productData.product_attributes.map(a => ({
                            attribute_id: a.attribute_id,
                            value: a.value
                        })));
                    } else {
                        setProductAttributes([{ attribute_id: '', value: '' }]);
                    }
                }

            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchData();

        // Click outside dropdown
        const handleClickOutside = (event) => {
            if (catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
                setIsCatDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, [id]);

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

    // --- XỬ LÝ ẢNH ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
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

    const removeOldGalleryImage = (imageId) => {
        if(confirm("Xóa ảnh này khỏi danh sách hiển thị? (Cần bấm Lưu để áp dụng)")) {
            setOldGallery(prev => prev.filter(img => img.id !== imageId));
        }
    };

    // --- XỬ LÝ THUỘC TÍNH ---
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

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price_buy', formData.price);
            // Không gửi qty khi edit
            data.append('description', formData.description);
            data.append('content', formData.description);
            data.append('status', formData.status);
            data.append('_method', 'PUT'); 

            if (imageFile) data.append('thumbnail', imageFile);

            galleryFiles.forEach((file) => {
                data.append('product_images[]', file);
            });

            const validAttributes = productAttributes.filter(a => a.attribute_id && a.value);
            data.append('attributes_json', JSON.stringify(validAttributes));

            const res = await ProductService.update(id, data);
            
            if (res.data && res.data.success) {
                alert('Cập nhật thành công!');
                router.push('/admin/product');
            } else {
                alert('Cập nhật thất bại: ' + (res.message || 'Lỗi không xác định'));
            }

        } catch (error) {
            console.error(error);
            alert('Lỗi hệ thống!');
        } finally {
            setLoading(false);
        }
    };

    // Tìm danh mục đang chọn để hiển thị ảnh
    const selectedCategory = categories.find(c => c.id == formData.category_id);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Cập nhật Sản phẩm</h1>
                <Link href="/admin/product" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon /> <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- CỘT TRÁI --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 space-y-4">
                        <h2 className="font-bold text-slate-700 border-b pb-2">Thông tin chung</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tên sản phẩm</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Giá bán</label>
                                <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none font-bold text-indigo-600" />
                            </div>
                            
                            {/* Ô TỒN KHO - READ ONLY */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tồn kho hiện tại</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={formData.stock} 
                                        readOnly 
                                        disabled
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-slate-500 font-bold cursor-not-allowed" 
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 italic">Để thay đổi số lượng, vui lòng dùng chức năng Nhập/Xuất kho.</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả</label>
                            <textarea name="description" rows="6" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none"></textarea>
                        </div>
                    </div>

                    {/* Thuộc tính */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="font-bold text-slate-700">Thuộc tính sản phẩm</h2>
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
                                            placeholder="Giá trị..." 
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
                        
                        {/* === CUSTOM DROPDOWN DANH MỤC === */}
                        <div ref={catDropdownRef} className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            
                            {/* Nút Trigger */}
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

                            {/* Input ẩn để validate */}
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
                        {/* === END CUSTOM DROPDOWN === */}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                                <option value="1">Xuất bản</option>
                                <option value="2">Nháp</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 text-center">
                        <label className="block text-sm font-bold text-slate-700 mb-2 text-left">Ảnh đại diện</label>
                        {previewUrl ? <img src={previewUrl} className="h-40 mx-auto object-contain mb-2" /> : currentImageUrl ? <img src={currentImageUrl} className="h-40 mx-auto object-contain mb-2 border" /> : <div className="h-40 flex items-center justify-center bg-gray-50 border-2 border-dashed rounded mb-2"><UploadIcon /></div>}
                        <input type="file" onChange={handleImageChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Thư viện ảnh</label>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            {oldGallery.map((img) => (
                                <div key={img.id} className="relative h-20 border rounded overflow-hidden group">
                                    <img src={ProductService.getImageUrl(img.image)} className="w-full h-full object-cover" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeOldGalleryImage(img.id)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <TrashIcon size={12}/>
                                    </button>
                                </div>
                            ))}
                            {galleryPreviews.map((src, idx) => (
                                <div key={`new-${idx}`} className="relative h-20 border rounded overflow-hidden border-indigo-300 group">
                                    <img src={src} className="w-full h-full object-cover" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeGalleryImage(idx)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5"
                                    >
                                        <TrashIcon size={12}/>
                                    </button>
                                </div>
                            ))}
                            <label className="h-20 border-2 border-dashed border-slate-300 rounded flex items-center justify-center cursor-pointer hover:bg-slate-50 transition">
                                <PlusIcon className="text-slate-400" />
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryChange} />
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-bold shadow-md">
                        {loading ? 'Đang lưu...' : <><SaveIcon /><span>Cập nhật sản phẩm</span></>}
                    </button>
                </div>
            </form>
        </div>
    );
}