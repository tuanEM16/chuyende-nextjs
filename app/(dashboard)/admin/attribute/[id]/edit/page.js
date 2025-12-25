'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AttributeService from '@/services/AttributeService';

const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const SaveIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;

export default function EditAttributePage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // CHỈ CÒN NAME
    const [name, setName] = useState('');

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await AttributeService.show(id);
                const data = res.data?.data || res.data; 
                
                if (data) {
                    setName(data.name || '');
                }
            } catch (error) {
                console.error("Lỗi tải:", error);
                alert("Không thể tải thông tin.");
                router.push('/admin/attribute');
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [id, router]);

const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = new FormData();
        dataToSend.append('name', name);
        dataToSend.append('_method', 'PUT'); 

        try {
            const res = await AttributeService.update(id, dataToSend);
            console.log("Phản hồi Update:", res); 

            // Logic kiểm tra đa năng tương tự
            const isSuccess = 
                res.success === true || 
                (res.data && res.data.success === true) ||
                res.status === 200 || 
                res.status === 201;

            if (isSuccess) {
                alert('Cập nhật thành công!');
                router.push('/admin/attribute');
            } else {
                const errorMsg = res.message || (res.data && res.data.message) || 'Lỗi không xác định';
                alert('Cập nhật thất bại: ' + errorMsg);
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || error.message || 'Lỗi hệ thống';
            alert('Lỗi: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center py-10 text-slate-500 animate-pulse">Đang tải dữ liệu...</div>;

    return (
        <div className="max-w-xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Cập nhật Thuộc tính</h1>
                <Link href="/admin/attribute" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon /> <span className="ml-2">Quay lại danh sách</span>
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
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-bold shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Đang lưu...' : <><SaveIcon /><span>Cập nhật</span></>}
                </button>
            </form>
        </div>
    );
}