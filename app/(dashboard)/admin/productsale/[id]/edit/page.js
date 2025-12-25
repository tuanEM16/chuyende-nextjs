'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductSaleService from '@/services/ProductSaleService';
import ProductService from '@/services/ProductService';

// --- ICONS ---
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const SaveIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

export default function EditSaleBulkPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const currentId = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    // Data nguồn
    const [productList, setProductList] = useState([]);

    // Form chung (Campaign Info)
    const [campaignInfo, setCampaignInfo] = useState({
        name: '',
        date_begin: '',
        date_end: '',
        status: 1
    });

    // Danh sách các item trong chiến dịch
    const [saleItems, setSaleItems] = useState([]);

    // Quick Setup State
    const [quickValue, setQuickValue] = useState(20);
    const [quickType, setQuickType] = useState('percent');

    // Format Date helper
    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return ''; 
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    useEffect(() => {
        if (!currentId) return;

        const initData = async () => {
            try {
                setFetching(true);
                const currentRes = await ProductSaleService.show(currentId);
                const currentData = currentRes.data?.data || currentRes.data;

                if (!currentData) throw new Error("Không tìm thấy thông tin khuyến mãi.");

                const allSalesRes = await ProductSaleService.index();
                const allSales = allSalesRes.data?.data || allSalesRes.data || [];

                const prodRes = await ProductService.index();
                const products = prodRes.data?.data || prodRes.data || [];
                setProductList(products);

                // Lọc ra các item cùng chiến dịch
                const siblings = allSales.filter(item => 
                    item.name === currentData.name && 
                    item.date_begin === currentData.date_begin && 
                    item.date_end === currentData.date_end
                );

                const targetItems = siblings.length > 0 ? siblings : [currentData];

                setCampaignInfo({
                    name: currentData.name,
                    date_begin: formatDateTime(currentData.date_begin),
                    date_end: formatDateTime(currentData.date_end),
                    status: currentData.status ?? 1
                });

                const mappedItems = targetItems.map(item => {
                    const prod = products.find(p => String(p.id) === String(item.product_id));
                    return {
                        id: item.id, 
                        product_id: item.product_id,
                        product_name: prod ? prod.name : `Sản phẩm #${item.product_id}`,
                        product_price_buy: prod ? prod.price_buy : 0,
                        product_thumbnail: prod ? prod.thumbnail : null,
                        price_sale: item.price_sale,
                        sku: prod ? prod.id : 'N/A', // Thêm SKU để hiển thị giống mẫu
                        is_deleted: false 
                    };
                });

                setSaleItems(mappedItems);

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                alert("Có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setFetching(false);
            }
        };

        initData();
    }, [currentId]);

    const handleCampaignChange = (e) => {
        const { name, value } = e.target;
        setCampaignInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleItemPriceChange = (index, newPrice) => {
        const newItems = [...saleItems];
        newItems[index].price_sale = newPrice;
        setSaleItems(newItems);
    };

    const handleRemoveItem = (index) => {
        if(confirm("Bạn muốn loại sản phẩm này khỏi đợt khuyến mãi?")) {
            const newItems = [...saleItems];
            newItems[index].is_deleted = true;
            setSaleItems(newItems);
        }
    };

    // Áp dụng thiết lập nhanh
    const applyQuickSettings = () => {
        const updatedList = saleItems.map(item => {
            if (item.is_deleted) return item;
            
            const original = Number(item.product_price_buy);
            let sale = 0;
            
            if (quickType === 'percent') {
                sale = original * (100 - quickValue) / 100;
            } else {
                sale = original - quickValue;
            }
            
            if (sale < 0) sale = 0;
            return { ...item, price_sale: Math.round(sale) };
        });
        
        setSaleItems(updatedList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (new Date(campaignInfo.date_end) < new Date(campaignInfo.date_begin)) {
            alert('Ngày kết thúc phải sau ngày bắt đầu!');
            setLoading(false);
            return;
        }

        try {
            const itemsToUpdate = saleItems.filter(item => !item.is_deleted);
            const itemsToDelete = saleItems.filter(item => item.is_deleted);

            const updatePromises = itemsToUpdate.map(item => {
                const payload = {
                    name: campaignInfo.name,
                    product_id: item.product_id,
                    price_sale: item.price_sale,
                    date_begin: campaignInfo.date_begin,
                    date_end: campaignInfo.date_end,
                    status: campaignInfo.status
                };
                return ProductSaleService.update(item.id, payload);
            });

            const deletePromises = itemsToDelete.map(item => {
                return ProductSaleService.destroy(item.id);
            });

            await Promise.all([...updatePromises, ...deletePromises]);

            alert(`Đã cập nhật thành công!`);
            router.push('/admin/productsale');

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra: " + (error.message || "Lỗi server"));
        } finally {
            setLoading(false);
        }
    };

    // Tính tổng doanh thu giảm dự kiến
    const totalReduction = saleItems.reduce((acc, item) => {
        if(item.is_deleted) return acc;
        const sale = Number(item.price_sale);
        const original = Number(item.product_price_buy);
        return acc + (original - sale);
    }, 0);

    if (fetching) return <div className="text-center py-20 text-slate-500 animate-pulse">Đang tải dữ liệu chiến dịch...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-slate-800">Cập nhật Chiến dịch Khuyến mãi</h1>
                <Link href="/admin/productsale" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon /> <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- CỘT TRÁI: THỜI GIAN ÁP DỤNG (Giống giao diện Add) --- */}
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
                                    value={campaignInfo.name}
                                    onChange={handleCampaignChange}
                                    name="name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Thời gian bắt đầu</label>
                                <input 
                                    type="datetime-local" 
                                    className="w-full border p-2 rounded focus:outline-none focus:border-orange-500"
                                    value={campaignInfo.date_begin}
                                    onChange={handleCampaignChange}
                                    name="date_begin"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Thời gian kết thúc</label>
                                <input 
                                    type="datetime-local" 
                                    className="w-full border p-2 rounded focus:outline-none focus:border-orange-500"
                                    value={campaignInfo.date_end}
                                    onChange={handleCampaignChange}
                                    name="date_end"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Trạng thái</label>
                                <select
                                    name="status"
                                    value={campaignInfo.status}
                                    onChange={handleCampaignChange}
                                    className="w-full border p-2 rounded focus:outline-none focus:border-orange-500"
                                >
                                    <option value="1">Hoạt động</option>
                                    <option value="2">Tạm ngưng</option>
                                </select>
                            </div>
                            <div className="bg-yellow-50 p-3 text-xs text-yellow-800 rounded border border-yellow-200">
                                ℹ️ Thay đổi ở đây sẽ cập nhật cho <b>{saleItems.filter(i => !i.is_deleted).length}</b> sản phẩm trong chiến dịch.
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
                                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                                    {saleItems.filter(i => !i.is_deleted).length}
                                </span>
                            </h2>
                        </div>

                        {/* --- THANH THIẾT LẬP NHANH (Giống trang Add) --- */}
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
                                type="button" // Quan trọng để ko submit form
                                onClick={applyQuickSettings}
                                className="text-sm text-red-600 font-bold hover:underline"
                            >
                                Áp dụng tất cả
                            </button>
                        </div>

                        {/* DANH SÁCH ITEM */}
                        <div className="space-y-4">
                            {saleItems.map((p, index) => {
                                if (p.is_deleted) return null;
                                
                                const original = Number(p.product_price_buy);
                                const sale = Number(p.price_sale || original);
                                const percent = original > 0 ? Math.round(((original - sale) / original) * 100) : 0;

                                return (
                                    <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition bg-white group">
                                        <div className="flex items-center gap-4 flex-1">
                                            <img src={ProductService.getImageUrl(p.product_thumbnail)} className="w-12 h-12 rounded object-cover border bg-slate-50" />
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm line-clamp-1">{p.product_name}</p>
                                                <p className="text-xs text-slate-500">SKU: {p.sku}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
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
                                                        onChange={(e) => handleItemPriceChange(index, e.target.value)}
                                                    />
                                                    {percent > 0 && (
                                                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">-{percent}%</span>
                                                    )}
                                                </div>
                                            </div>

                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveItem(index)} 
                                                className="text-slate-300 hover:text-red-500 p-2"
                                                title="Loại khỏi đợt này"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                            {saleItems.filter(i => !i.is_deleted).length === 0 && (
                                <div className="text-center py-10 text-slate-400 italic">
                                    Danh sách trống.
                                </div>
                            )}
                        </div>

                        {/* FOOTER TỔNG KẾT */}
                        {saleItems.filter(i => !i.is_deleted).length > 0 && (
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
                        disabled={loading || saleItems.filter(i => !i.is_deleted).length === 0}
                        className={`w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Đang lưu...' : <><SaveIcon /> HOÀN TẤT & LƯU THAY ĐỔI</>}
                    </button>
                </div>
            </form>
        </div>
    );
}