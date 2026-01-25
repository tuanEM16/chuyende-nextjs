'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BannerService from '@/services/BannerService';


const ArrowLeftIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const EditIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

export default function BannerDetail({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();

    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!id) return;
        const fetchBanner = async () => {
            try {
                const res = await BannerService.show(id);

                const data = res.data?.data || res.data;
                setBanner(data);
            } catch (error) {
                console.error("Lỗi tải chi tiết:", error);
                alert("Không tìm thấy Banner!");
                router.push('/admin/banner');
            } finally {
                setLoading(false);
            }
        };
        fetchBanner();
    }, [id]);

    if (loading) return <div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>;
    if (!banner) return <div className="p-10 text-center text-red-500">Banner không tồn tại.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/banner" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition">
                        <ArrowLeftIcon />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">Chi tiết Banner</h1>
                </div>
                
                <Link 
                    href={`/admin/banner/${banner.id}/edit`} 
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow"
                >
                    <EditIcon /> <span>Chỉnh sửa</span>
                </Link>
            </div>

            {/* Nội dung chính */}
            <div className="grid grid-cols-1 gap-6">
                
                {/* 1. Hình ảnh Banner (Hiển thị to) */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase">Hình ảnh hiển thị</h3>
                    <div className="bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                        <img 
                            src={BannerService.getImageUrl(banner.image)} 
                            alt={banner.name} 
                            className="max-w-full h-auto object-contain max-h-[400px]"
                            onError={(e) => { e.target.src = "https://placehold.co/800x300?text=No+Image"; }}
                        />
                    </div>
                </div>

                {/* 2. Thông tin chi tiết */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-700 border-b pb-2 text-sm uppercase">Thông tin cơ bản</h3>
                        
                        <div>
                            <span className="text-slate-500 text-sm block">Tên Banner</span>
                            <span className="font-bold text-lg text-slate-800">{banner.name}</span>
                        </div>

                        <div>
                            <span className="text-slate-500 text-sm block">Vị trí</span>
                            <span className="inline-block bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-sm font-medium capitalize mt-1">
                                {banner.position}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-500 text-sm block">Liên kết (Link)</span>
                            <a href={banner.link} target="_blank" className="text-blue-600 hover:underline break-all block mt-1">
                                {banner.link || 'Không có liên kết'}
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-700 border-b pb-2 text-sm uppercase">Cấu hình & Trạng thái</h3>
                        
                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">Thứ tự sắp xếp (Sort):</span>
                            <span className="font-mono font-bold">{banner.sort_order}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">Trạng thái:</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${banner.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {banner.status === 1 ? 'Đang hiện' : 'Đang ẩn'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-500 text-sm block mb-1">Mô tả:</span>
                            <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded border">
                                {banner.description || "Không có mô tả"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}