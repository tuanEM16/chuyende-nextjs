'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductAttributeService from '@/services/ProductAttributeService';


const PlusIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const EditIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

export default function ProductAttributeList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(''); // Thêm biến để hiện lỗi ra màn hình

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Bắt đầu gọi API...");
                const res = await ProductAttributeService.index();
                console.log("API trả về:", res);


                const data = res.data?.data || res.data || [];
                if (Array.isArray(data)) {
                    setItems(data);
                } else {
                    console.warn("Dữ liệu không phải mảng:", data);
                    setItems([]);
                }
            } catch (error) {
                console.error("Lỗi chết người:", error);
                setErrorMsg(error.message || "Lỗi không xác định");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if(!confirm('Xóa nhé?')) return;
        try {
            await ProductAttributeService.destroy(id);
            setItems(items.filter(i => i.id !== id));
        } catch (error) {
            alert("Xóa lỗi: " + error.message);
        }
    };


    if (errorMsg) return (
        <div className="p-10 text-center text-red-500">
            <h2 className="text-xl font-bold">Toang rồi ông giáo ạ!</h2>
            <p>{errorMsg}</p>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Chi tiết Thuộc tính SP</h1>
                <Link href="/admin/productattribute/add" className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow transition">
                    <PlusIcon /> <span>Thêm Giá trị Mới</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                {loading ? (
                    <div className="text-center py-10 text-slate-500">Đang tải dữ liệu... (Đợi xíu)</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Sản phẩm</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Loại</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Giá trị</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {items.length > 0 ? items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-xs font-mono">#{item.id}</td>
                                        <td className="px-6 py-4 font-medium">
                                            {/* Kiểm tra null an toàn */}
                                            {item.product?.name || <span className="text-red-400">Không tìm thấy SP</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.attribute?.name || <span className="text-gray-400">--</span>}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-indigo-600">
                                            {item.value}
                                        </td>
                                        <td className="px-6 py-4 text-center flex justify-center gap-2">
                                            <Link href={`/admin/productattribute/${item.id}/edit`} className="text-blue-500 p-2"><EditIcon /></Link>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-500 p-2"><TrashIcon /></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-slate-400">
                                            Không có dữ liệu nào (API trả về rỗng).
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}