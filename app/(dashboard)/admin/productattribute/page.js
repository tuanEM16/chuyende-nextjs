'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductAttributeService from '@/services/ProductAttributeService';

// Icons
const PlusIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

export default function ProductAttributeList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        ProductAttributeService.index().then(res => {
            if(res.success) setItems(res.data || []);
        });
    }, []);

    const handleDelete = async (id) => {
        if(confirm('Xóa giá trị này?')) {
            await ProductAttributeService.destroy(id);
            setItems(items.filter(i => i.id !== id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Chi tiết Thuộc tính SP</h1>
                <Link href="/admin/productattribute/add" className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    <PlusIcon /> <span>Thêm Giá trị</span>
                </Link>
            </div>

            <div className="bg-white rounded shadow overflow-hidden border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại thuộc tính</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá trị</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {item.product ? item.product.name : `Product ID: ${item.product_id}`}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {item.attribute ? item.attribute.name : `Attribute ID: ${item.attribute_id}`}
                                </td>
                                <td className="px-6 py-4 font-bold text-indigo-600">
                                    {item.value}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}