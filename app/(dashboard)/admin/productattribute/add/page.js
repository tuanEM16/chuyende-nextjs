'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductAttributeService from '@/services/ProductAttributeService';
import ProductService from '@/services/ProductService';
import AttributeService from '@/services/AttributeService';

export default function AddProductAttribute() {
    const router = useRouter();
    
    // Data nguồn để chọn
    const [products, setProducts] = useState([]);
    const [attributes, setAttributes] = useState([]);
    
    const [form, setForm] = useState({
        product_id: '',
        attribute_id: '',
        value: ''
    });

    // Load danh sách Sản phẩm và Loại thuộc tính
    useEffect(() => {
        Promise.all([
            ProductService.index(),
            AttributeService.index()
        ]).then(([prodRes, attrRes]) => {
            if(prodRes.success) setProducts(prodRes.data.data || prodRes.data || []);
            if(attrRes.success) setAttributes(attrRes.data.data || attrRes.data || []);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ProductAttributeService.store(form);
            alert('Gán thuộc tính thành công!');
            router.push('/admin/productattribute');
        } catch (error) {
            alert('Lỗi khi thêm');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Gán Thuộc tính cho Sản phẩm</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4 border border-slate-200">
                
                {/* Chọn Sản phẩm */}
                <div>
                    <label className="block text-sm font-medium mb-1">Chọn Sản phẩm</label>
                    <select 
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={e => setForm({...form, product_id: e.target.value})} 
                        required
                    >
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Chọn Loại Thuộc tính */}
                <div>
                    <label className="block text-sm font-medium mb-1">Chọn Loại thuộc tính</label>
                    <select 
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={e => setForm({...form, attribute_id: e.target.value})} 
                        required
                    >
                        <option value="">-- Chọn thuộc tính (Màu, Size...) --</option>
                        {attributes.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                </div>

                {/* Nhập Giá trị */}
                <div>
                    <label className="block text-sm font-medium mb-1">Giá trị</label>
                    <input 
                        type="text" 
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="VD: Đỏ, Xanh, XL, 30kg..."
                        onChange={e => setForm({...form, value: e.target.value})} 
                        required
                    />
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-medium shadow">
                    Lưu
                </button>
            </form>
        </div>
    );
}