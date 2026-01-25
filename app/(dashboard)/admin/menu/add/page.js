'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MenuService from '@/services/MenuService';
import CategoryService from '@/services/CategoryService';
import TopicService from '@/services/TopicService';

export default function AddMenuPage() {
    const router = useRouter();
    

    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [menus, setMenus] = useState([]); // Để chọn menu cha


    const [form, setForm] = useState({
        name: '',
        link: '',
        type: 'custom', // custom, category, topic
        table_id: 0,
        parent_id: 0,
        position: 'mainmenu',
        sort_order: 0,
        status: 1
    });


    useEffect(() => {
        (async () => {
            const [catRes, topicRes, menuRes] = await Promise.all([
                CategoryService.index(),
                TopicService.index(),
                MenuService.index()
            ]);

            if(catRes.success) setCategories(catRes.data.data || catRes.data || []);
            if(topicRes.success) setTopics(topicRes.data.data || topicRes.data || []);
            if(menuRes.success) setMenus(menuRes.data.data || menuRes.data || []);
        })();
    }, []);


    const handleTypeChange = (e) => {
        const type = e.target.value;
        setForm(prev => ({ 
            ...prev, 
            type: type,
            link: '', // Reset link
            table_id: 0,
            name: ''  // Reset tên
        }));
    };


    const handleSelectionChange = (e) => {
        const id = e.target.value;
        const type = form.type;
        let selectedItem = null;

        if (type === 'category') {
            selectedItem = categories.find(c => String(c.id) === id);
            if (selectedItem) {
                setForm(prev => ({
                    ...prev,
                    table_id: selectedItem.id,
                    name: selectedItem.name,
                    link: `/danh-muc/${selectedItem.slug}` // Tự động tạo link chuẩn SEO
                }));
            }
        } else if (type === 'topic') {
            selectedItem = topics.find(t => String(t.id) === id);
            if (selectedItem) {
                setForm(prev => ({
                    ...prev,
                    table_id: selectedItem.id,
                    name: selectedItem.name,
                    link: `/chu-de/${selectedItem.slug}`
                }));
            }
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await MenuService.store(form);
            alert('Thêm menu thành công!');
            router.push('/admin/menu');
        } catch (error) {
            alert('Lỗi thêm mới');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Thêm Menu Mới</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6 border border-slate-200">
                
                {/* Chọn Loại Menu */}
                <div>
                    <label className="block text-sm font-medium mb-1">Loại Menu</label>
                    <select name="type" value={form.type} onChange={handleTypeChange} className="w-full border p-2 rounded outline-none bg-slate-50">
                        <option value="custom">Liên kết tùy chỉnh (Custom)</option>
                        <option value="category">Danh mục Sản phẩm</option>
                        <option value="topic">Chủ đề Bài viết</option>
                    </select>
                </div>

                {/* Giao diện ĐỘNG dựa theo Loại Menu */}
                {form.type === 'custom' ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tên Menu</label>
                            <input name="name" type="text" required onChange={handleChange} className="w-full border p-2 rounded" placeholder="VD: Trang chủ" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Đường dẫn (Link)</label>
                            <input name="link" type="text" required onChange={handleChange} className="w-full border p-2 rounded" placeholder="VD: /lien-he" />
                        </div>
                    </>
                ) : (
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Chọn {form.type === 'category' ? 'Danh mục' : 'Chủ đề'}
                        </label>
                        <select onChange={handleSelectionChange} className="w-full border p-2 rounded">
                            <option value="">-- Chọn --</option>
                            {form.type === 'category' && categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                            {form.type === 'topic' && topics.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                        </select>
                        {/* Hiển thị review kết quả */}
                        <div className="mt-2 text-sm text-slate-500 bg-slate-50 p-2 rounded">
                            <p><strong>Tên hiển thị:</strong> {form.name || '(Chưa chọn)'}</p>
                            <p><strong>Link tạo tự động:</strong> {form.link || '(Chưa chọn)'}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Vị trí</label>
                        <select name="position" onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="mainmenu">Main Menu (Header)</option>
                            <option value="footermenu">Footer Menu</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Menu Cha</label>
                        <select name="parent_id" onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="0">-- Là menu gốc --</option>
                            {menus.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Thứ tự</label>
                        <input name="sort_order" type="number" defaultValue={0} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Trạng thái</label>
                        <select name="status" onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="1">Hiển thị</option>
                            <option value="2">Ẩn</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-bold shadow">
                    Lưu Menu
                </button>
            </form>
        </div>
    );
}