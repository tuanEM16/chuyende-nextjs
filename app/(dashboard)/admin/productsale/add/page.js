'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductSaleService from '@/services/ProductSaleService';
import ProductService from '@/services/ProductService';

// --- ICONS ---
const SaveIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const LightningIcon = ({ size = 18 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

export default function AddProductSalePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    
    // State form chính
    const [form, setForm] = useState({
        name: '',
        date_begin: '',
        date_end: '',
        product_id: '',
        price_sale: ''
    });

    // State hỗ trợ tính toán nhanh
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quickValue, setQuickValue] = useState(0); // Giá trị nhập ở ô thiết lập nhanh
    const [quickType, setQuickType] = useState('percent'); // 'percent' hoặc 'amount'

    // 1. Load danh sách sản phẩm
    useEffect(() => {
        ProductService.index().then(res => {
            if(res.success) {
                setProducts(res.data.data || res.data || []);
            }
        });
    }, []);

    // 2. Xử lý khi chọn sản phẩm
    const handleProductChange = (e) => {
        const prodId = e.target.value;
        const product = products.find(p => String(p.id) === String(prodId));
        
        setSelectedProduct(product || null);
        setForm(prev => ({ 
            ...prev, 
            product_id: prodId, 
            price_sale: '' // Reset giá sale khi đổi SP
        }));
    };

    // 3. CHỨC NĂNG: ÁP DỤNG THIẾT LẬP NHANH
    const applyQuickSetup = () => {
        if (!selectedProduct) {
            alert("Vui lòng chọn sản phẩm trước!");
            return;
        }
        
        const originalPrice = Number(selectedProduct.price_buy);
        let newPrice = 0;

        if (quickType === 'percent') {
            // Giảm theo % (Ví dụ: 20%)
            // Giá mới = Giá gốc * (100 - 20) / 100
            newPrice = originalPrice * (100 - quickValue) / 100;
        } else {
            // Giảm theo số tiền (Ví dụ: Giảm 50k)
            newPrice = originalPrice - quickValue;
        }

        // Làm tròn và gán vào form
        if (newPrice < 0) newPrice = 0;
        setForm(prev => ({ ...prev, price_sale: Math.round(newPrice) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ProductSaleService.store(form);
            alert('Đã đẩy lên product_sale thành công!');
            router.push('/admin/productsale');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Lỗi: Kiểm tra lại dữ liệu';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Tạo chương trình khuyến mãi</h1>
                <Link href="/admin/productsale" className="flex items-center text-slate-500 hover:text-indigo-600">
                    <ArrowLeftIcon /> <span className="ml-2">Quay lại</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- CỘT TRÁI: THỜI GIAN --- */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                        <h2 className="font-bold text-orange-600 mb-4 border-b pb-2">🕑 Thời gian áp dụng</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên chương trình</label>
                                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border p-2 rounded" placeholder="VD: Sale Hè 2025" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bắt đầu</label>
                                <input type="datetime-local" value={form.date_begin} onChange={e => setForm({...form, date_begin: e.target.value})} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Kết thúc</label>
                                <input type="datetime-local" value={form.date_end} onChange={e => setForm({...form, date_end: e.target.value})} className="w-full border p-2 rounded" required />
                            </div>
                            <div className="bg-yellow-50 p-3 text-xs text-yellow-700 rounded border border-yellow-200">
                                ℹ️ Khuyến mãi sẽ tự động kết thúc vào thời gian này. Sản phẩm sẽ trở về giá gốc.
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI: SẢN PHẨM & TÍNH TOÁN --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                        <h2 className="font-bold text-red-600 mb-4 border-b pb-2">🏷️ Sản phẩm khuyến mãi</h2>

                        {/* 1. Chọn sản phẩm */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Chọn sản phẩm:</label>
                            <select 
                                className="w-full border p-3 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={handleProductChange}
                                required
                            >
                                <option value="">-- Chọn sản phẩm --</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} (Giá gốc: {Number(p.price_buy).toLocaleString()}đ)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Thanh Thiết lập nhanh (Chỉ hiện khi đã chọn SP) */}
                        {selectedProduct && (
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                                <div className="flex items-center gap-2 mb-2 text-sm font-bold text-slate-700">
                                    <LightningIcon /> THIẾT LẬP NHANH
                                </div>
                                <div className="flex gap-2">
                                    <select 
                                        className="border p-2 rounded bg-white"
                                        value={quickType}
                                        onChange={(e) => setQuickType(e.target.value)}
                                    >
                                        <option value="percent">Giảm theo %</option>
                                        <option value="amount">Giảm theo số tiền</option>
                                    </select>
                                    
                                    <input 
                                        type="number" 
                                        className="border p-2 rounded w-32"
                                        placeholder={quickType === 'percent' ? "VD: 20" : "VD: 50000"}
                                        value={quickValue}
                                        onChange={(e) => setQuickValue(e.target.value)}
                                    />
                                    <span className="flex items-center text-slate-500 font-bold">
                                        {quickType === 'percent' ? '%' : 'đ'}
                                    </span>

                                    <button 
                                        type="button"
                                        onClick={applyQuickSetup}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold text-sm ml-auto"
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 3. Hiển thị kết quả tính toán */}
                        {selectedProduct && (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b text-sm text-slate-500">
                                        <th className="py-2">Sản phẩm</th>
                                        <th className="py-2 text-right">Giá gốc</th>
                                        <th className="py-2 text-right">Giá Khuyến Mãi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-4 font-medium text-slate-800">
                                            {selectedProduct.name}
                                            <div className="text-xs text-slate-400">SKU: {selectedProduct.id}</div>
                                        </td>
                                        <td className="py-4 text-right text-slate-500 line-through">
                                            {Number(selectedProduct.price_buy).toLocaleString()} đ
                                        </td>
                                        <td className="py-4 text-right">
                                            <input 
                                                type="number" 
                                                className="border-2 border-red-200 text-red-600 font-bold p-2 rounded w-40 text-right outline-none focus:border-red-500"
                                                value={form.price_sale}
                                                onChange={e => setForm({...form, price_sale: e.target.value})}
                                                placeholder="0"
                                                required
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className={`w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Đang lưu...' : <><SaveIcon /> Xác nhận Khuyến Mãi</>}
                    </button>
                </div>
            </form>
        </div>
    );
}