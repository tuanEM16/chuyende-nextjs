'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductStoreService from '@/services/ProductStoreService';
import ProductService from '@/services/ProductService';

const SaveIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

export default function EditInventoryPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Dữ liệu phiếu nhập
    const [storeData, setStoreData] = useState(null); 
    
    const [form, setForm] = useState({
        price_root: '',
        qty: ''
    });

    useEffect(() => {
        if(!id) return;
        ProductStoreService.show(id).then(res => {
            if(res.success) {
                setStoreData(res.data);
                setForm({
                    price_root: res.data.price_root,
                    qty: res.data.qty
                });
            }
            setLoading(false);
        });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Chỉ gửi qty và price_root (product_id không đổi)
            await ProductStoreService.update(id, form);
            alert('Cập nhật phiếu nhập thành công! Tồn kho đã được tính toán lại.');
            router.push('/admin/productstore');
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể cập nhật'));
        } finally {
            setSubmitting(false);
        }
    };

    if(loading) return <div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>;
    if(!storeData) return <div className="p-10 text-center text-red-500">Không tìm thấy phiếu nhập.</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Sửa Phiếu Nhập #{id}</h1>
                <Link href="/admin/productstore" className="flex items-center gap-1 text-slate-500 hover:text-indigo-600">
                    <ArrowLeftIcon /> Quay lại
                </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow border border-slate-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Thông tin sản phẩm (Read-only) */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4 items-center opacity-80">
                        {storeData.product ? (
                            <>
                                <img src={ProductService.getImageUrl(storeData.product.thumbnail)} className="w-16 h-16 rounded border bg-white object-cover" />
                                <div>
                                    <p className="font-bold text-slate-700">{storeData.product.name}</p>
                                    <p className="text-sm text-slate-500">Sản phẩm này không thể thay đổi khi sửa phiếu.</p>
                                </div>
                            </>
                        ) : (
                            <p className="text-red-500 italic">Sản phẩm gốc đã bị xóa</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Giá nhập (Vốn)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    className="w-full border p-3 rounded-lg outline-none focus:border-indigo-500"
                                    value={form.price_root}
                                    onChange={e => setForm({...form, price_root: e.target.value})}
                                    required
                                />
                                <span className="absolute right-3 top-3 text-slate-400 text-sm">VNĐ</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng</label>
                            <input 
                                type="number" 
                                className="w-full border p-3 rounded-lg outline-none focus:border-indigo-500 font-bold"
                                min="1"
                                value={form.qty}
                                onChange={e => setForm({...form, qty: e.target.value})}
                                required
                            />
                            <p className="text-[10px] text-slate-400 mt-1">Thay đổi số lượng sẽ tự động cộng/trừ vào kho tổng.</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition disabled:opacity-70"
                        >
                            {submitting ? 'Đang lưu...' : 'CẬP NHẬT PHIẾU'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}