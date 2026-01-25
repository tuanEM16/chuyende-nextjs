'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AttributeService from '@/services/AttributeService';

const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const SaveIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;

export default function AddAttributePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const [name, setName] = useState('');

const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = new FormData();
        dataToSend.append('name', name);

        try {
            const res = await AttributeService.store(dataToSend);
            

            console.log("Phản hồi từ Server:", res); 





            const isSuccess = 
                res.success === true || 
                (res.data && res.data.success === true) ||
                res.status === 201 || 
                res.status === 200;

            if (isSuccess) {
                alert('Thêm thuộc tính thành công!');
                router.push('/admin/attribute');
            } else {

                const errorMsg = res.message || (res.data && res.data.message) || 'Lỗi phản hồi từ server';
                alert('Thêm thất bại: ' + errorMsg);
            }

        } catch (error) {
            console.error("Lỗi Catch:", error);

            const errorMsg = error.response?.data?.message || error.message || 'Lỗi hệ thống';
            alert('Lỗi: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Thêm Thuộc tính</h1>
                <Link href="/admin/attribute" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon /> <span className="ml-2">Quay lại</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tên thuộc tính <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none transition"
                        placeholder="Ví dụ: Kích thước, Màu sắc..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-bold shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Đang lưu...' : <><SaveIcon /><span>Lưu Thuộc tính</span></>}
                </button>
            </form>
        </div>
    );
}