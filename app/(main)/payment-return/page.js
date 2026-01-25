'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Home, ShoppingBag, Loader2 } from 'lucide-react';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'; // ✅ thêm useRef
import OrderService from '@/services/OrderService';
import { useCart } from '../../context/CartContext';

function PaymentResult() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const responseCode = searchParams.get('vnp_ResponseCode');
  const transactionNo = searchParams.get('vnp_TransactionNo');
  const amount = searchParams.get('vnp_Amount');
  const orderId = searchParams.get('vnp_TxnRef');

  const isVnPaySuccess = responseCode === '00';
  const canCheck = useMemo(() => Boolean(orderId), [orderId]);

  const [status, setStatus] = useState('processing'); // processing | success | error
  const [message, setMessage] = useState('Đang xác nhận giao dịch...');

  const calledRef = useRef(false); // ✅ chặn gọi lại (StrictMode dev)

  useEffect(() => {
    if (!canCheck) {
      setStatus('error');
      setMessage('Không tìm thấy mã đơn hàng.');
      return;
    }


    if (!isVnPaySuccess) {
      setStatus('error');
      setMessage('Giao dịch thất bại hoặc bị hủy tại VNPay.');
      return;
    }


    if (calledRef.current) return;
    calledRef.current = true;

    const run = async () => {
      try {
        const qs = searchParams.toString();
        if (!qs) {
          setStatus('error');
          setMessage('Thiếu dữ liệu trả về từ VNPay.');
          return;
        }


        const res = await OrderService.verifyVnpayReturn(qs);

        if (res?.data?.success && res?.data?.paid) {
          setStatus('success');
          setMessage('Thanh toán thành công! Đơn hàng đã được xác nhận.');
          clearCart();
        } else {
          setStatus('error');
          setMessage(res?.data?.message || 'Chưa xác nhận thanh toán.');
        }
      } catch (e) {
        setStatus('error');
        setMessage('Không thể xác minh giao dịch với server.');
      }
    };

    run();
  }, [canCheck, isVnPaySuccess, searchParams, clearCart]);

  if (status === 'processing') {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-10 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Đang xác nhận...</h2>
        <p className="text-gray-500 mt-2">Hệ thống đang xác minh giao dịch với server.</p>
      </div>
    );
  }

  const isFinalSuccess = status === 'success';

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className={`p-8 text-center ${isFinalSuccess ? 'bg-green-600' : 'bg-red-600'}`}>
        <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          {isFinalSuccess ? (
            <CheckCircle className="w-14 h-14 text-white" />
          ) : (
            <XCircle className="w-14 h-14 text-white" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {isFinalSuccess ? 'Thanh toán thành công!' : 'Chưa xác nhận!'}
        </h1>
        <p className="text-white/90">{message}</p>
      </div>

      <div className="p-8">
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-sm space-y-4 border border-slate-100">
          <div className="flex justify-between">
            <span className="text-gray-500">Mã giao dịch:</span>
            <span className="font-semibold text-gray-900">{transactionNo || '---'}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-4 mt-2">
            <span className="text-gray-500">Tổng tiền:</span>
            <span className={`font-bold text-lg ${isFinalSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {amount ? (Number(amount) / 100).toLocaleString('vi-VN') : 0}₫
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 transition">
            <Home className="w-5 h-5" /> Về trang chủ
          </Link>
          <Link href="/product" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition">
            <ShoppingBag className="w-5 h-5" /> Tiếp tục mua sắm
          </Link>
          <Link href="/user/order" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition">
            Xem lịch sử đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-10 px-4 flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentResult />
      </Suspense>
    </div>
  );
}
