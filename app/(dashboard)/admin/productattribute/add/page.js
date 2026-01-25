'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProductAttributeService from '@/services/ProductAttributeService';
import ProductService from '@/services/ProductService';
import AttributeService from '@/services/AttributeService';


const SaveIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const ChevronDown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>;
const TagIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;

export default function AddProductAttribute() {
    const router = useRouter();


    const [loading, setLoading] = useState(false);


    const [products, setProducts] = useState([]);
    const [attributes, setAttributes] = useState([]); // Danh sách thuộc tính (Màu, Size...)


    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);


    const [form, setForm] = useState({
        attribute_id: '',
        value: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {

                const [prodRes, attrRes] = await Promise.all([
                    ProductService.index({ limit: 2000 }),
                    AttributeService.index()
                ]);



                const prodBody = prodRes.data?.data;
                const prodList = Array.isArray(prodBody) ? prodBody : (prodBody?.data || []);

                setProducts(prodList);


                const attrBody = attrRes.data?.data;
                const attrList = Array.isArray(attrBody) ? attrBody : (attrBody?.data || attrRes.data || []);

                setAttributes(attrList);


                console.log("Đã tải sản phẩm:", prodList);
                console.log("Đã tải thuộc tính:", attrList);

            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);

            }
        };

        loadData();
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProduct) return alert("Vui lòng chọn sản phẩm!");
        if (!form.attribute_id) return alert("Vui lòng chọn loại thuộc tính!");
        if (!form.value) return alert("Vui lòng nhập giá trị!");

        setLoading(true);
        try {
            const payload = {
                product_id: selectedProduct.id,
                attribute_id: form.attribute_id,
                value: form.value
            };

            await ProductAttributeService.store(payload);
            alert('Gán thuộc tính thành công!');
            router.push('/admin/productattribute');
        } catch (error) {
            console.error(error);
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể thêm thuộc tính'));
        } finally {
            setLoading(false);
        }
    };


    const filteredProducts = products.filter(p =>
        (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(p.id).includes(searchTerm)
    );

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <TagIcon /> Gán Thuộc tính Sản phẩm
            </h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">

                {/* 1. CHỌN SẢN PHẨM (Custom Dropdown - Có hình & Tìm kiếm) */}
                <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Sản phẩm <span className="text-red-500">*</span></label>

                    <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full border p-3 rounded-lg cursor-pointer flex items-center justify-between bg-white hover:border-indigo-400 transition ${isDropdownOpen ? 'ring-2 ring-indigo-100 border-indigo-500' : 'border-slate-300'}`}
                    >
                        {selectedProduct ? (
                            <div className="flex items-center gap-3 overflow-hidden">
                                <img
                                    src={ProductService.getImageUrl(selectedProduct.thumbnail)}
                                    className="w-10 h-10 rounded object-cover border bg-slate-100"
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

                    {isDropdownOpen && (
                        <div className="absolute z-10 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col">
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
                                        onClick={() => {
                                            setSelectedProduct(p);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="flex items-center gap-3 p-3 hover:bg-indigo-50 cursor-pointer border-b last:border-0 transition"
                                    >
                                        <img
                                            src={ProductService.getImageUrl(p.thumbnail)}
                                            className="w-8 h-8 rounded object-cover border bg-white"
                                            onError={(e) => e.target.src = "https://placehold.co/50x50"}
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{p.name}</p>
                                            <p className="text-xs text-slate-500">ID: {p.id}</p>
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

                {/* 2. CHỌN LOẠI THUỘC TÍNH (Select Box truyền thống) */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Loại thuộc tính <span className="text-red-500">*</span></label>
                    <select
                        className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                        onChange={e => setForm({ ...form, attribute_id: e.target.value })}
                        value={form.attribute_id}
                        required
                    >
                        <option value="">-- Chọn loại (VD: Màu sắc, Kích thước...) --</option>
                        {attributes.length > 0 ? (
                            attributes.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))
                        ) : (
                            <option disabled>Không có dữ liệu thuộc tính</option>
                        )}
                    </select>
                    {attributes.length === 0 && (
                        <p className="text-xs text-red-500 mt-1">
                            ⚠️ Danh sách thuộc tính trống. Hãy kiểm tra console (F12) xem API có trả về dữ liệu không.
                        </p>
                    )}
                </div>

                {/* 3. NHẬP GIÁ TRỊ */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Giá trị <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        placeholder="VD: Đỏ, XL, 32GB..."
                        value={form.value}
                        onChange={e => setForm({ ...form, value: e.target.value })}
                        required
                    />
                </div>

                {/* Nút Submit */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Đang lưu...' : <><SaveIcon /> LƯU THUỘC TÍNH</>}
                    </button>
                </div>
            </form>
        </div>
    );
}