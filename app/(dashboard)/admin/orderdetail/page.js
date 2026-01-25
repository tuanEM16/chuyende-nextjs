'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { Loader2, Search, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import ProductService from '@/services/ProductService'; // Service để lấy ảnh
import OrderDetailService from '@/services/OrderDetailService'; // Service bạn vừa tạo

function OrderDetailContent() {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    

    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get('orderId');

    useEffect(() => {
        if (orderIdParam) {
            setSearchTerm(orderIdParam);
        }
        fetchDetails();
    }, [orderIdParam]);

    const fetchDetails = async () => {
        try {

            const response = await OrderDetailService.index(); 
            
            if (response.data && response.data.success) {

                const list = Array.isArray(response.data.data) ? response.data.data : [];
                setDetails(list);
            }
        } catch (error) {
            console.error("Lỗi tải chi tiết đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };


    const filteredDetails = details.filter(item => 
        (item.order_id?.toString() || '').includes(searchTerm) ||
        (item.product && item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    const totalAmount = filteredDetails.reduce((sum, item) => sum + Number(item.amount), 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header trang */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    {/* Nút quay lại nếu đang xem chi tiết 1 đơn */}
                    {orderIdParam && (
                        <Link href="/admin/order" className="p-2 hover:bg-slate-200 rounded-full transition" title="Quay lại danh sách">
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </Link>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {orderIdParam ? `Chi tiết đơn hàng #${orderIdParam}` : 'Chi tiết đơn hàng'}
                        </h1>
                        {orderIdParam && <p className="text-sm text-slate-500">Xem danh sách sản phẩm của đơn hàng này</p>}
                    </div>
                </div>

                {/* Ô tìm kiếm */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Lọc mã đơn hoặc tên SP..."
                        className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    
                    {searchTerm && (
                        <button 
                            onClick={() => { setSearchTerm(''); window.history.replaceState(null, '', '/admin/orderdetail'); }}
                            className="absolute right-2 top-2 text-xs text-slate-400 hover:text-indigo-600 font-medium px-2 py-1 bg-slate-100 rounded"
                        >
                            Xóa
                        </button>
                    )}
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4 text-left">Sản phẩm</th>
                                <th className="px-6 py-4 text-center">Mã Đơn</th>
                                <th className="px-6 py-4 text-center">Số lượng</th>
                                <th className="px-6 py-4 text-right">Đơn giá</th>
                                <th className="px-6 py-4 text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredDetails.length > 0 ? (
                                filteredDetails.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition duration-150">
                                        {/* Cột sản phẩm + Hình ảnh */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                                    {item.product ? (
                                                        <img 
                                                            src={ProductService.getImageUrl(item.product.thumbnail)} 
                                                            alt={item.product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-6 w-6 text-slate-300 m-auto mt-3" />
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {item.product ? item.product.name : <span className="text-red-500 italic">Sản phẩm đã xóa</span>}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        ID Chi tiết: #{item.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                #{item.order_id}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center text-sm text-slate-600 font-semibold">
                                            x{item.qty}
                                        </td>

                                        <td className="px-6 py-4 text-right text-sm text-slate-600">
                                            {Number(item.price).toLocaleString('vi-VN')}₫
                                        </td>

                                        <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600">
                                            {Number(item.amount).toLocaleString('vi-VN')}₫
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="w-10 h-10 text-slate-300 mb-3" />
                                            <p className="text-lg font-medium">Không tìm thấy dữ liệu</p>
                                            <p className="text-sm">Thử tìm kiếm với từ khóa khác.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        
                        {/* Footer tổng tiền (Chỉ hiện khi lọc theo ID hoặc có dữ liệu) */}
                        {filteredDetails.length > 0 && (
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider">
                                        Tổng cộng:
                                    </td>
                                    <td className="px-6 py-4 text-right text-lg font-bold text-indigo-700">
                                        {totalAmount.toLocaleString('vi-VN')}₫
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
}


export default function OrderDetailPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>}>
            <OrderDetailContent />
        </Suspense>
    );
}