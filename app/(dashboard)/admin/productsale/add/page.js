'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductSaleService from '@/services/ProductSaleService';
import ProductService from '@/services/ProductService';

// --- ICONS ---
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const PlusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function AddProductSalePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Data
    const [allProducts, setAllProducts] = useState([]); // Tất cả SP từ API
    const [selectedProducts, setSelectedProducts] = useState([]); // Danh sách SP ĐÃ CHỌN để sale

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tempSelectedIds, setTempSelectedIds] = useState([]); // ID được tích trong Modal (chưa bấm xác nhận)

    // Form Info
    const [campaign, setCampaign] = useState({ name: '', date_begin: '', date_end: '' });
    
    // Quick Setup (Thiết lập nhanh)
    const [quickValue, setQuickValue] = useState(20);
    const [quickType, setQuickType] = useState('percent');

    // 1. Load All Products
    useEffect(() => {
        ProductService.index().then(res => {
            if (res.data?.data || Array.isArray(res.data)) {
                setAllProducts(res.data.data || res.data);
            }
        });
    }, []);

    // --- LOGIC MODAL ---
    const openModal = () => {
        setTempSelectedIds(selectedProducts.map(p => p.id)); // Load lại các ID đã chọn trước đó
        setIsModalOpen(true);
    };

    const handleModalToggleOne = (id) => {
        if (tempSelectedIds.includes(id)) {
            setTempSelectedIds(prev => prev.filter(item => item !== id));
        } else {
            setTempSelectedIds(prev => [...prev, id]);
        }
    };

    const handleModalSelectAll = (e) => {
        if (e.target.checked) {
            // Chọn hết các SP đang hiển thị trong modal (theo search)
            const visibleIds = filteredModalProducts.map(p => p.id);
            // Merge với các ID đã chọn trước đó để không bị mất
            const uniqueIds = [...new Set([...tempSelectedIds, ...visibleIds])];
            setTempSelectedIds(uniqueIds);
        } else {
            setTempSelectedIds([]);
        }
    };

    const confirmSelection = () => {
        // Lọc ra các object sản phẩm từ mảng ID
        const newSelectedProducts = allProducts.filter(p => tempSelectedIds.includes(p.id));
        
        // Map sang cấu trúc có thêm field price_sale (nếu chưa có thì mặc định)
        const productsWithPrice = newSelectedProducts.map(p => {
            // Nếu SP này đã có trong danh sách cũ thì giữ nguyên giá sale cũ
            const old = selectedProducts.find(oldP => oldP.id === p.id);
            return old ? old : { ...p, price_sale: '' };
        });

        setSelectedProducts(productsWithPrice);
        setIsModalOpen(false);
    };

    // --- LOGIC TRANG CHÍNH ---
    const removeProduct = (id) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== id));
    };

    const updateSalePrice = (id, newPrice) => {
        setSelectedProducts(prev => prev.map(p => 
            p.id === id ? { ...p, price_sale: newPrice } : p
        ));
    };

    const applyQuickSettings = () => {
        if (selectedProducts.length === 0) return;

        const updatedList = selectedProducts.map(p => {
            const original = Number(p.price_buy);
            let sale = 0;
            if (quickType === 'percent') {
                sale = original * (100 - quickValue) / 100;
            } else {
                sale = original - quickValue;
            }
            if (sale < 0) sale = 0;
            return { ...p, price_sale: Math.round(sale) };
        });
        
        setSelectedProducts(updatedList);
    };

    // --- SUBMIT ---
    const handleSubmit = async () => {
        if (!campaign.name || !campaign.date_begin || !campaign.date_end) {
            alert("Vui lòng nhập thông tin thời gian!");
            return;
        }
        if (selectedProducts.length === 0) {
            alert("Chưa chọn sản phẩm nào!");
            return;
        }

        setLoading(true);

        // Chuẩn bị payload
        const productsPayload = selectedProducts.map(p => ({
            product_id: p.id,
            price_sale: p.price_sale || 0
        }));

        const payload = { ...campaign, products: productsPayload };

        try {
            await ProductSaleService.store(payload);
            alert('Đã tạo chương trình khuyến mãi thành công!');
            router.push('/admin/productsale');
        } catch (error) {
            console.error(error);
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể lưu'));
        } finally {
            setLoading(false);
        }
    };

    // Filter tìm kiếm trong Modal
    const filteredModalProducts = useMemo(() => {
        return allProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allProducts, searchTerm]);

    // Tính tổng doanh thu dự kiến giảm (cho vui mắt giống hình mẫu)
    const totalReduction = selectedProducts.reduce((acc, p) => {
        const sale = Number(p.price_sale || p.price_buy);
        const original = Number(p.price_buy);
        return acc + (original - sale);
    }, 0);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Tạo Chương Trình Khuyến Mãi Mới</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- CỘT TRÁI: THỜI GIAN --- */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
                        <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold border-b pb-2">
                            <ClockIcon /> THỜI GIAN ÁP DỤNG
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Tên chương trình</label>
                                <input 
                                    type="text" 
                                    className="w-full border p-2 rounded focus:ring-2 ring-orange-200 outline-none"
                                    placeholder="VD: Sale 12.12"
                                    value={campaign.name}
                                    onChange={e => setCampaign({...campaign, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Thời gian bắt đầu</label>
                                <input 
                                    type="datetime-local" 
                                    className="w-full border p-2 rounded focus:outline-none focus:border-orange-500"
                                    value={campaign.date_begin}
                                    onChange={e => setCampaign({...campaign, date_begin: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Thời gian kết thúc</label>
                                <input 
                                    type="datetime-local" 
                                    className="w-full border p-2 rounded focus:outline-none focus:border-orange-500"
                                    value={campaign.date_end}
                                    onChange={e => setCampaign({...campaign, date_end: e.target.value})}
                                />
                            </div>
                            <div className="bg-yellow-50 p-3 text-xs text-yellow-800 rounded border border-yellow-200">
                                ℹ️ Khuyến mãi sẽ tự động kết thúc vào thời gian này. Sản phẩm sẽ trở về giá gốc.
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI: DANH SÁCH SẢN PHẨM --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                🏷️ Sản phẩm khuyến mãi
                                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{selectedProducts.length}</span>
                            </h2>
                            <button 
                                onClick={openModal}
                                className="flex items-center gap-2 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 font-bold text-sm transition"
                            >
                                <PlusIcon /> Thêm sản phẩm
                            </button>
                        </div>

                        {/* THANH THIẾT LẬP NHANH */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap items-center gap-3 mb-6">
                            <span className="text-sm font-bold text-slate-600 uppercase">Thiết lập nhanh:</span>
                            <select 
                                className="border p-1.5 rounded text-sm outline-none"
                                value={quickType}
                                onChange={e => setQuickType(e.target.value)}
                            >
                                <option value="percent">Giảm theo %</option>
                                <option value="amount">Giảm tiền</option>
                            </select>
                            <input 
                                type="number" 
                                className="w-20 border p-1.5 rounded text-sm outline-none"
                                value={quickValue}
                                onChange={e => setQuickValue(e.target.value)}
                            />
                            <button 
                                onClick={applyQuickSettings}
                                className="text-sm text-red-600 font-bold hover:underline"
                            >
                                Áp dụng tất cả
                            </button>
                        </div>

                        {/* DANH SÁCH SẢN PHẨM ĐÃ CHỌN */}
                        <div className="space-y-4">
                            {selectedProducts.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                                    Chưa có sản phẩm nào. Bấm "Thêm sản phẩm" để bắt đầu.
                                </div>
                            ) : (
                                selectedProducts.map((p) => {
                                    const original = Number(p.price_buy);
                                    const sale = Number(p.price_sale || original);
                                    const percent = original > 0 ? Math.round(((original - sale) / original) * 100) : 0;

                                    return (
                                        <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition bg-white group">
                                            <div className="flex items-center gap-4 flex-1">
                                                <img src={ProductService.getImageUrl(p.thumbnail)} className="w-12 h-12 rounded object-cover border" />
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                                                    <p className="text-xs text-slate-500">SKU: {p.id}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400 font-bold">GIÁ GỐC</p>
                                                    <p className="text-sm text-slate-500 line-through">{original.toLocaleString()}đ</p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs text-red-500 font-bold mb-1">GIÁ KHUYẾN MÃI</p>
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="number" 
                                                            className="w-28 border border-red-200 p-1.5 rounded text-right font-bold text-red-600 outline-none focus:border-red-500"
                                                            value={p.price_sale}
                                                            placeholder="0"
                                                            onChange={(e) => updateSalePrice(p.id, e.target.value)}
                                                        />
                                                        {percent > 0 && (
                                                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">-{percent}%</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button onClick={() => removeProduct(p.id)} className="text-slate-300 hover:text-red-500 p-2">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* FOOTER TỔNG KẾT */}
                        {selectedProducts.length > 0 && (
                            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
                                <div className="text-right w-full">
                                    <p className="text-xs text-slate-500 uppercase">Tổng doanh thu dự kiến giảm</p>
                                    <p className="text-xl font-bold text-orange-600">~ {totalReduction.toLocaleString()} đ</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={loading || selectedProducts.length === 0}
                        className={`w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Đang lưu...' : 'HOÀN TẤT & LƯU CHƯƠNG TRÌNH'}
                    </button>
                </div>
            </div>

            {/* --- MODAL CHỌN SẢN PHẨM --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-fadeIn">
                        
                        {/* Modal Header */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Chọn sản phẩm khuyến mãi</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Modal Search */}
                        <div className="p-4 bg-slate-50 border-b">
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-400"><SearchIcon /></span>
                                <input 
                                    type="text" 
                                    placeholder="Tìm kiếm theo tên sản phẩm..." 
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Modal List (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-0">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="px-6 py-3 w-10">
                                            <input 
                                                type="checkbox" 
                                                className="w-5 h-5 rounded text-indigo-600 cursor-pointer"
                                                onChange={handleModalSelectAll}
                                                checked={filteredModalProducts.length > 0 && filteredModalProducts.every(p => tempSelectedIds.includes(p.id))}
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Sản phẩm</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Giá gốc</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Tồn kho</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredModalProducts.map(p => (
                                        <tr key={p.id} className={`hover:bg-slate-50 cursor-pointer ${tempSelectedIds.includes(p.id) ? 'bg-indigo-50' : ''}`} onClick={() => handleModalToggleOne(p.id)}>
                                            <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                                                <input 
                                                    type="checkbox" 
                                                    className="w-5 h-5 rounded text-indigo-600 cursor-pointer"
                                                    checked={tempSelectedIds.includes(p.id)}
                                                    onChange={() => handleModalToggleOne(p.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <img src={ProductService.getImageUrl(p.thumbnail)} className="w-10 h-10 rounded border object-cover" />
                                                <span className="font-medium text-slate-700">{p.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-slate-600">
                                                {Number(p.price_buy).toLocaleString()}đ
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-500">
                                                {p.qty || 0}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredModalProducts.length === 0 && (
                                        <tr><td colSpan="4" className="py-8 text-center text-slate-400">Không tìm thấy sản phẩm.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t flex justify-between items-center bg-slate-50 rounded-b-xl">
                            <span className="text-sm font-medium text-slate-600">Đã chọn: <b className="text-indigo-600">{tempSelectedIds.length}</b> sản phẩm</span>
                            <div className="flex gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition">Hủy bỏ</button>
                                <button onClick={confirmSelection} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg">Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}