'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductStoreService from '@/services/ProductStoreService';
import ProductService from '@/services/ProductService';


const SaveIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

export default function EditInventoryBulkPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const currentId = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    

    const [batchInfo, setBatchInfo] = useState({
        created_at: '', // Thời gian nhập kho
        total_items: 0
    });


    const [storeItems, setStoreItems] = useState([]);


    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleString('vi-VN'); // Hiển thị dạng text cho đẹp
    };

    useEffect(() => {
        if (!currentId) return;

        const initData = async () => {
            try {
                setFetching(true);
                

                const currentRes = await ProductStoreService.show(currentId);
                const currentData = currentRes.data?.data || currentRes.data;

                if (!currentData) throw new Error("Không tìm thấy phiếu nhập.");



                const allStoreRes = await ProductStoreService.index({ limit: 2000 });

                const allStores = Array.isArray(allStoreRes.data?.data) 
                    ? allStoreRes.data.data 
                    : (allStoreRes.data?.data?.data || []);



                const prodRes = await ProductService.index({ limit: 2000 });
                const products = Array.isArray(prodRes.data?.data) 
                    ? prodRes.data.data 
                    : (prodRes.data?.data?.data || []);



                const siblings = allStores.filter(item => item.created_at === currentData.created_at);
                const targetItems = siblings.length > 0 ? siblings : [currentData];


                setBatchInfo({
                    created_at: currentData.created_at,
                    total_items: targetItems.length
                });


                const mappedItems = targetItems.map(item => {
                    const prod = products.find(p => String(p.id) === String(item.product_id));
                    return {
                        id: item.id, // ID phiếu nhập
                        product_id: item.product_id,
                        product_name: prod ? prod.name : `Sản phẩm #${item.product_id}`,
                        product_thumbnail: prod ? prod.thumbnail : null,
                        product_sku: prod ? prod.id : 'N/A',
                        price_root: item.price_root,
                        qty: item.qty,
                        is_deleted: false
                    };
                });

                setStoreItems(mappedItems);

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);

            } finally {
                setFetching(false);
            }
        };

        initData();
    }, [currentId]);


    const handlePriceChange = (index, value) => {
        const newItems = [...storeItems];
        newItems[index].price_root = value;
        setStoreItems(newItems);
    };


    const handleQtyChange = (index, value) => {
        const newItems = [...storeItems];
        newItems[index].qty = value;
        setStoreItems(newItems);
    };


    const handleRemoveItem = (index) => {
        if(confirm("Bạn muốn xóa sản phẩm này khỏi phiếu nhập? Tồn kho sẽ bị trừ đi.")) {
            const newItems = [...storeItems];
            newItems[index].is_deleted = true;
            setStoreItems(newItems);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const itemsToUpdate = storeItems.filter(item => !item.is_deleted);
            const itemsToDelete = storeItems.filter(item => item.is_deleted);


            const updatePromises = itemsToUpdate.map(item => {
                const payload = {
                    product_id: item.product_id, // Giữ nguyên
                    price_root: item.price_root,
                    qty: item.qty,

                };
                return ProductStoreService.update(item.id, payload);
            });


            const deletePromises = itemsToDelete.map(item => {
                return ProductStoreService.destroy(item.id);
            });

            await Promise.all([...updatePromises, ...deletePromises]);

            alert(`Cập nhật thành công!`);
            router.push('/admin/productstore');

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra: " + (error.message || "Lỗi server"));
        } finally {
            setLoading(false);
        }
    };


    const totalImportValue = storeItems.reduce((acc, item) => {
        if(item.is_deleted) return acc;
        return acc + (Number(item.price_root) * Number(item.qty));
    }, 0);

    if (fetching) return <div className="text-center py-20 text-slate-500 animate-pulse">Đang tải dữ liệu lô hàng...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-800">Sửa Lô Nhập Kho</h1>
                <Link href="/admin/productstore" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon /> <span className="ml-2">Quay lại danh sách</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* --- CỘT TRÁI: THÔNG TIN LÔ HÀNG --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
                        <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold border-b pb-2">
                            <ClockIcon /> THÔNG TIN LÔ NHẬP
                        </div>
                        
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-slate-500">Thời gian nhập:</p>
                                <p className="font-mono font-bold text-slate-700">{formatDateTime(batchInfo.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Số lượng mã hàng:</p>
                                <p className="font-bold text-slate-700">{storeItems.filter(i => !i.is_deleted).length}</p>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-slate-500">Tổng giá trị lô hàng:</p>
                                <p className="text-xl font-bold text-blue-600">{totalImportValue.toLocaleString()} đ</p>
                            </div>
                            
                            <div className="bg-blue-50 p-3 text-xs text-blue-800 rounded border border-blue-100 mt-4">
                                ℹ️ Các sản phẩm này được nhập cùng một thời điểm. Bạn có thể sửa giá vốn và số lượng nhập cho từng món.
                            </div>
                        </div>

                        <div className="mt-6">
                            <button 
                                onClick={handleSubmit}
                                disabled={loading || storeItems.filter(i => !i.is_deleted).length === 0}
                                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Đang lưu...' : <><SaveIcon /> LƯU THAY ĐỔI</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI: DANH SÁCH SẢN PHẨM --- */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800">Chi tiết sản phẩm nhập</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Sản phẩm</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Giá Nhập (Vốn)</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Số Lượng</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Thành Tiền</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {storeItems.map((item, index) => {
                                        if (item.is_deleted) return null;
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            src={ProductService.getImageUrl(item.product_thumbnail)} 
                                                            className="w-10 h-10 rounded object-cover border bg-slate-100"
                                                            onError={(e) => e.target.src="https://placehold.co/50x50?text=Error"}
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-900 line-clamp-1 max-w-[200px]" title={item.product_name}>
                                                                {item.product_name}
                                                            </div>
                                                            <div className="text-xs text-slate-500">SKU: {item.product_sku}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <input 
                                                            type="number" 
                                                            className="w-32 border border-slate-300 p-1.5 rounded text-right font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                                            value={item.price_root}
                                                            onChange={(e) => handlePriceChange(index, e.target.value)}
                                                            min="0"
                                                        />
                                                        <span className="ml-2 text-xs text-slate-400">đ</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input 
                                                        type="number" 
                                                        className="w-20 border border-slate-300 p-1.5 rounded text-center font-bold text-blue-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                                        value={item.qty}
                                                        onChange={(e) => handleQtyChange(index, e.target.value)}
                                                        min="1"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-700">
                                                    {(Number(item.price_root) * Number(item.qty)).toLocaleString()} đ
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button 
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
                                                        title="Xóa khỏi phiếu nhập"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {storeItems.filter(i => !i.is_deleted).length === 0 && (
                                        <tr><td colSpan="5" className="py-10 text-center text-slate-400 italic">Phiếu nhập trống.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}