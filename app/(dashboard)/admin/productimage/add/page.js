'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProductImageService from '@/services/ProductImageService';
import ProductService from '@/services/ProductService';

// --- ICONS ---
const UploadIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const ChevronDown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>;

export default function AddProductImageMulti() {
    const router = useRouter();

    // --- STATE ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // State cho Dropdown tìm kiếm sản phẩm
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // State cho form và files
    const [files, setFiles] = useState([]); // Mảng các file đã chọn
    const [previews, setPreviews] = useState([]); // Mảng URL preview
    const [baseInfo, setBaseInfo] = useState({
        alt: '',
        title: ''
    });

    // --- EFFECT ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Thêm limit lớn để lấy hết sản phẩm (tránh lỗi tìm kiếm không thấy ở trang 2)
                const res = await ProductService.index({ limit: 2000 });

                if (res.data && res.data.success) {
                    // 👇 SỬA DÒNG NÀY (Quan trọng nhất) 👇
                    // Phải lấy mảng nằm sâu trong: res.data (body) -> data (paginator) -> data (array)
                    const productList = res.data.data?.data || [];

                    setProducts(productList);
                }
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    // --- HANDLERS ---

    // Xử lý chọn nhiều ảnh
    const handleFileChange = (e) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            // Cập nhật mảng file
            setFiles(prev => [...prev, ...selectedFiles]);

            // Tạo preview URL
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    // Xóa một ảnh khỏi danh sách chờ upload
    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Xử lý chọn sản phẩm từ dropdown
    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setIsDropdownOpen(false);
        // Tự động điền title/alt gợi ý theo tên sản phẩm nếu đang trống
        if (!baseInfo.title) setBaseInfo(prev => ({ ...prev, title: product.name }));
        if (!baseInfo.alt) setBaseInfo(prev => ({ ...prev, alt: `Hình ảnh ${product.name}` }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProduct) return alert("Vui lòng chọn sản phẩm!");
        if (files.length === 0) return alert("Vui lòng chọn ít nhất 1 ảnh!");

        setLoading(true);

        try {
            // Vì Backend API hiện tại (ProductImageController.store) chỉ nhận 1 ảnh/lần
            // Ta sẽ dùng vòng lặp để gọi API nhiều lần (Promise.all) cho từng ảnh.

            const uploadPromises = files.map((file, index) => {
                const formData = new FormData();
                formData.append('product_id', selectedProduct.id);
                // Tạo title/alt thông minh: Ví dụ "iPhone 15 (1)", "iPhone 15 (2)"
                formData.append('title', `${baseInfo.title} (${index + 1})`);
                formData.append('alt', baseInfo.alt);
                formData.append('image', file);

                return ProductImageService.store(formData);
            });

            await Promise.all(uploadPromises);

            alert(`Đã upload thành công ${files.length} ảnh!`);
            router.push('/admin/productimage');

        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi upload. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Lọc sản phẩm theo tìm kiếm
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.id).includes(searchTerm)
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <UploadIcon /> Upload Thư viện Ảnh
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* --- CỘT TRÁI: Form nhập liệu --- */}
                <div className="md:col-span-1 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">

                        {/* 1. Custom Dropdown chọn sản phẩm */}
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Sản phẩm áp dụng</label>

                            {/* Nút bấm mở dropdown */}
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full border p-3 rounded-lg cursor-pointer flex items-center justify-between bg-white hover:border-indigo-400 transition ${isDropdownOpen ? 'ring-2 ring-indigo-100 border-indigo-500' : 'border-slate-300'}`}
                            >
                                {selectedProduct ? (
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <img
                                            src={ProductService.getImageUrl(selectedProduct.thumbnail)}
                                            className="w-8 h-8 rounded object-cover border bg-slate-100"
                                            onError={(e) => e.target.src = "https://placehold.co/50x50"}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">{selectedProduct.name}</p>
                                            <p className="text-[10px] text-slate-500">ID: {selectedProduct.id}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-slate-500 text-sm">-- Chọn sản phẩm --</span>
                                )}
                                <ChevronDown />
                            </div>

                            {/* Danh sách dropdown (Hiện khi isDropdownOpen = true) */}
                            {isDropdownOpen && (
                                <div className="absolute z-10 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-80 overflow-hidden flex flex-col">
                                    {/* Ô tìm kiếm */}
                                    <div className="p-2 border-b bg-slate-50 sticky top-0">
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-slate-400"><SearchIcon /></span>
                                            <input
                                                type="text"
                                                placeholder="Tìm tên hoặc ID..."
                                                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-indigo-500"
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {/* List Items */}
                                    <div className="overflow-y-auto flex-1">
                                        {filteredProducts.map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => handleSelectProduct(p)}
                                                className="flex items-center gap-3 p-3 hover:bg-indigo-50 cursor-pointer border-b last:border-0 transition"
                                            >
                                                <img
                                                    src={ProductService.getImageUrl(p.thumbnail)}
                                                    className="w-10 h-10 rounded object-cover border bg-white"
                                                    onError={(e) => e.target.src = "https://placehold.co/50x50"}
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">{p.name}</p>
                                                    <p className="text-xs text-slate-500">ID: {p.id} - Giá: {Number(p.price_buy).toLocaleString()}đ</p>
                                                </div>
                                            </div>
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <div className="p-4 text-center text-slate-500 text-sm">Không tìm thấy sản phẩm.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Nhập thông tin SEO chung */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề chung (Title)</label>
                            <input
                                type="text"
                                value={baseInfo.title}
                                onChange={e => setBaseInfo({ ...baseInfo, title: e.target.value })}
                                className="w-full border border-slate-300 p-3 rounded-lg text-sm focus:border-indigo-500 outline-none"
                                placeholder="VD: iPhone 15 Promax"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">Hệ thống sẽ tự thêm số thứ tự vào sau. VD: iPhone 15 Promax (1)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Alt Text chung</label>
                            <input
                                type="text"
                                value={baseInfo.alt}
                                onChange={e => setBaseInfo({ ...baseInfo, alt: e.target.value })}
                                className="w-full border border-slate-300 p-3 rounded-lg text-sm focus:border-indigo-500 outline-none"
                                placeholder="Mô tả ảnh cho SEO..."
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || files.length === 0}
                                className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Đang Upload...' : `LƯU ${files.length} ẢNH`}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- CỘT PHẢI: Khu vực chọn và Preview ảnh --- */}
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[500px]">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-slate-800">Ảnh đã chọn ({files.length})</h2>

                            {/* Nút Upload giả lập (Label for input) */}
                            <label className="cursor-pointer bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-indigo-100 transition flex items-center gap-2 border border-indigo-200">
                                <UploadIcon /> Thêm ảnh từ máy
                                <input
                                    type="file"
                                    multiple // Quan trọng: Cho phép chọn nhiều file
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Grid Preview */}
                        {files.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {previews.map((src, index) => (
                                    <div key={index} className="relative group bg-slate-50 rounded-lg border border-slate-200 overflow-hidden aspect-square">
                                        <img src={src} className="w-full h-full object-contain p-2" alt="Preview" />

                                        {/* Overlay xóa */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition"
                                                title="Xóa ảnh này"
                                            >
                                                <XIcon />
                                            </button>
                                        </div>

                                        {/* Badge số thứ tự */}
                                        <span className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                                            #{index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-400">
                                <UploadIcon />
                                <p className="mt-2 font-medium">Chưa có ảnh nào được chọn</p>
                                <p className="text-sm">Bấm nút "Thêm ảnh từ máy" để bắt đầu</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}