'use client';

import { useState, useEffect } from 'react';
import ConfigService from '@/services/ConfigService';

// Icon Save
const SaveIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;

export default function ConfigPage() {
    const [form, setForm] = useState({
        site_name: '',
        email: '',
        phone: '',
        hotline: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await ConfigService.getConfig();

                // 👇 SỬA LẠI: Phải chọc vào res.data trước
                if (res.data && res.data.success) {

                    // Lấy dữ liệu thật (thường nằm ở res.data.data)
                    const configData = res.data.data || {};

                    setForm({
                        site_name: configData.site_name || '',
                        email: configData.email || '',
                        phone: configData.phone || '',
                        hotline: configData.hotline || '',
                        address: configData.address || ''
                    });
                }
            } catch (error) {
                console.error("Lỗi tải cấu hình:", error);
            }
        };

        fetchConfig();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ConfigService.updateConfig(form);
            alert('Cập nhật cấu hình thành công!');
        } catch (error) {
            console.error(error);
            alert('Lỗi cập nhật');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Cấu hình Website</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow border border-slate-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tên Website</label>
                        <input name="site_name" value={form.site_name} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email liên hệ</label>
                        <input name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                        <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hotline</label>
                        <input name="hotline" value={form.hotline} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-indigo-500 outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
                    <input name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-indigo-500 outline-none" />
                </div>

                <div className="pt-4 border-t">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-2.5 rounded hover:bg-indigo-700 font-medium w-full md:w-auto shadow-md"
                    >
                        {loading ? 'Đang lưu...' : <><SaveIcon /> <span>Lưu Cấu Hình</span></>}
                    </button>
                </div>
            </form>
        </div>
    );
}