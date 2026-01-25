'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductStoreService from '@/services/ProductStoreService';
import ProductService from '@/services/ProductService';


const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const SaveIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

export default function BulkImportPage() {
    const router = useRouter();
    const [allProducts, setAllProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [importList, setImportList] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await ProductService.index({ limit: 2000 });

                if (res.data && res.data.success) {
                    const list = res.data.data?.data || [];

                    setAllProducts(list);
                }
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            }
        };
        fetchData();
    }, []);


    const addToImportList = (product) => {

        const exists = importList.find(item => item.id === product.id);
        if (exists) {
            alert("Sản phẩm này đã có trong danh sách nhập!");
            return;
        }

        const newItem = {
            ...product,
            importQty: 1, // Số lượng nhập mặc định
            importPrice: product.price_root || 0 // Giá nhập mặc định (lấy giá cũ nếu có)
        };
        setImportList([newItem, ...importList]);
        setSearchTerm('');
        setShowSuggestions(false);
    };


    const updateItem = (id, field, value) => {
        setImportList(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };


    const removeItem = (id) => {
        setImportList(prev => prev.filter(item => item.id !== id));
    };


    const handleSave = async () => {
        if (importList.length === 0) return alert("Chưa có sản phẩm nào!");


        const invalidItem = importList.find(item => item.importQty <= 0 || item.importPrice < 0);
        if (invalidItem) {
            alert(`Sản phẩm "${invalidItem.name}" có số lượng hoặc giá không hợp lệ!`);
            return;
        }

        setLoading(true);
        try {



            const promises = importList.map(item => {
                return ProductStoreService.store({
                    product_id: item.id,
                    price_root: item.importPrice,
                    qty: item.importQty
                });
            });

            await Promise.all(promises);

            alert("Đã nhập kho tất cả sản phẩm thành công!");
            router.push('/admin/productstore');
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi lưu! Vui lòng kiểm tra lại.");
        } finally {
            setLoading(false);
        }
    };


    const filteredSuggestions = allProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-slate-800">Tạo Phiếu Nhập Kho</h1>
                <Link href="/admin/productstore" className="flex items-center text-slate-500 hover:text-indigo-600 font-medium">
                    <ArrowLeftIcon /> Quay lại danh sách
                </Link>
            </div>

            {/* --- THANH TÌM KIẾM SẢN PHẨM --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative z-50">
                <div className="flex items-center gap-3 w-full border rounded-lg px-4 py-3 bg-slate-50 focus-within:bg-white focus-within:ring-2 ring-indigo-100 transition">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm theo tên, mã SKU để thêm vào phiếu nhập..."
                        className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
                        onFocus={() => setShowSuggestions(true)}
                    />
                    <div className="bg-slate-200 text-xs px-2 py-1 rounded font-bold text-slate-500">F3</div>
                </div>

                {/* Dropdown Gợi ý */}
                {showSuggestions && searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-80 overflow-y-auto animate-fadeIn">
                        {filteredSuggestions.map(p => (
                            <div
                                key={p.id}
                                onClick={() => addToImportList(p)}
                                className="p-3 hover:bg-indigo-50 cursor-pointer flex items-center gap-3 border-b last:border-0 group"
                            >
                                <img src={ProductService.getImageUrl(p.thumbnail)} className="w-12 h-12 rounded border object-cover bg-white" />
                                <div className="flex-1">
                                    <p className="font-bold text-slate-700 text-sm group-hover:text-indigo-700">{p.name}</p>
                                    <div className="flex gap-4 text-xs text-slate-500 mt-1">
                                        <span>SKU: {p.id}</span>
                                        <span>|</span>
                                        <span>Tồn kho hiện tại: <b className="text-slate-700">{p.qty || 0}</b></span>
                                    </div>
                                </div>
                                <div className="text-indigo-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition">
                                    + Chọn
                                </div>
                            </div>
                        ))}
                        {filteredSuggestions.length === 0 && <div className="p-4 text-center text-slate-400">Không tìm thấy sản phẩm phù hợp.</div>}
                    </div>
                )}
            </div>

            {/* --- BẢNG DANH SÁCH NHẬP --- */}
            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase w-10">#</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Sản phẩm</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Đơn vị</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase w-40">Số lượng nhập</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase w-48">Giá nhập (VNĐ)</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase w-48">Thành tiền</th>
                            <th className="px-6 py-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {importList.map((item, index) => {
                            const total = Number(item.importQty) * Number(item.importPrice);
                            return (
                                <tr key={item.id} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-4 text-slate-400 font-medium text-sm">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 border rounded bg-slate-50 flex-shrink-0">
                                                <img src={ProductService.getImageUrl(item.thumbnail)} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                                                <div className="text-xs text-slate-500 mt-1">SKU: {item.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-600">
                                        {item.unit || 'Cái'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <input
                                            type="number"
                                            className="w-full border border-slate-300 rounded px-3 py-2 text-center font-bold focus:ring-2 ring-indigo-200 outline-none text-indigo-600"
                                            value={item.importQty}
                                            onChange={e => updateItem(item.id, 'importQty', e.target.value)}
                                            min="1"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">Trong kho: {item.qty || 0}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <input
                                            type="number"
                                            className="w-full border border-slate-300 rounded px-3 py-2 text-right font-medium focus:ring-2 ring-indigo-200 outline-none"
                                            value={item.importPrice}
                                            onChange={e => updateItem(item.id, 'importPrice', e.target.value)}
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                                        {total.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition p-2">
                                            <TrashIcon />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {importList.length === 0 && (
                            <tr>
                                <td colSpan="7" className="py-20 text-center text-slate-400 flex flex-col items-center justify-center bg-slate-50">
                                    <span className="text-4xl mb-3 opacity-50">📦</span>
                                    <p>Chưa có sản phẩm nào trong phiếu nhập.</p>
                                    <p className="text-sm">Vui lòng tìm kiếm và thêm sản phẩm ở trên.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Footer Actions */}
                <div className="mt-auto bg-slate-50 border-t border-slate-200 p-6 flex justify-end items-center">
                    <div className="flex gap-8 items-center">
                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Tổng số lượng</p>
                            <p className="text-lg font-bold text-slate-700">
                                {importList.reduce((sum, item) => sum + Number(item.importQty), 0)}
                            </p>
                        </div>
                        <div className="text-right mr-4 border-l pl-8 border-slate-200">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Tổng tiền thanh toán</p>
                            <p className="text-3xl font-bold text-indigo-600">
                                {importList.reduce((sum, item) => sum + (item.importQty * item.importPrice), 0).toLocaleString()} ₫
                            </p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={loading || importList.length === 0}
                            className={`bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2 transition ${loading || importList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Đang xử lý...' : <><SaveIcon /> HOÀN TẤT & LƯU</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}