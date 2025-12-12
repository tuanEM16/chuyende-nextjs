'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductImageService from '@/services/ProductImageService';
import ProductService from '@/services/ProductService';

export default function AddProductImage() {
    const router = useRouter();
    
    // Data sản phẩm để chọn
    const [products, setProducts] = useState([]);
    
    const [form, setForm] = useState({
        product_id: '',
        alt: '',
        title: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // Load danh sách sản phẩm
    useEffect(() => {
        ProductService.index().then(res => {
            if(res.success) setProducts(res.data.data || res.data || []);
        });
    }, []);

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('product_id', form.product_id);
        data.append('alt', form.alt);
        data.append('title', form.title);
        
        if (image) {
            data.append('image', image);
        } else {
            alert("Vui lòng chọn ảnh!");
            return;
        }

        try {
            await ProductImageService.store(data);
            alert('Upload ảnh thành công!');
            router.push('/admin/productimage');
        } catch (error) {
            alert('Lỗi upload ảnh');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Upload Ảnh Sản phẩm</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4 border border-slate-200">
                
                <div>
                    <label className="block text-sm font-medium mb-1">Chọn Sản phẩm</label>
                    <select name="product_id" onChange={handleChange} required className="w-full border p-2 rounded outline-none">
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">File Ảnh</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full" />
                    {preview && (
                        <div className="mt-3">
                            <img src={preview} alt="Preview" className="h-40 object-contain rounded border" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tiêu đề (Title)</label>
                    <input name="title" type="text" onChange={handleChange} className="w-full border p-2 rounded outline-none" placeholder="Tiêu đề ảnh..." />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Văn bản thay thế (Alt)</label>
                    <input name="alt" type="text" onChange={handleChange} className="w-full border p-2 rounded outline-none" placeholder="Mô tả ảnh cho SEO..." />
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-medium shadow">
                    Lưu Ảnh
                </button>
            </form>
        </div>
    );
}