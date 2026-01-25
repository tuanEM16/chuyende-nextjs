'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ProductService from '@/services/ProductService';
import OrderService from '@/services/OrderService';

export default function CartPage() {
  const router = useRouter();

  const { cart, removeFromCart, updateQuantity, cartTotal = 0, clearCart } = useCart();
  const { user } = useAuth();

  const [processing, setProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);


  const [shippingAddress, setShippingAddress] = useState('');

  useEffect(() => setIsMounted(true), []);

  const totalItems = cart ? cart.reduce((total, item) => total + (item.qty || 0), 0) : 0;

  const getPrice = (item) => {
    if (item.pricesale && item.pricesale > 0) return item.pricesale;
    return item.price || 0;
  };


  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('shippingAddress') || '' : '';
    setShippingAddress((user?.address || saved || '').trim());
  }, [user]);


  const handlePayment = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thanh toán.');
      router.push('/login');
      return;
    }
    if (!cart || cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    if (!shippingAddress.trim()) {
      alert('Vui lòng nhập địa chỉ nhận hàng trước khi thanh toán.');
      return;
    }

    try {
      setProcessing(true);

      const payload = {
        name: user?.name || 'Khách vãng lai',
        phone: user?.phone || '0999999999',
        email: user?.email || 'guest@example.com',
        address: shippingAddress.trim(), // ✅ lấy từ input
        note: 'Thanh toán qua VNPAY',
        cart: cart,
        amount: cartTotal,
      };


      const res = await OrderService.checkout(payload);

      if (!res?.data?.success) {
        alert(res?.data?.message || 'Lỗi tạo đơn hàng');
        setProcessing(false);
        return;
      }

      const orderId = res.data.order_id;


      const payRes = await OrderService.createVnpayUrl(orderId);

      if (payRes?.data?.success && payRes?.data?.payment_url) {
        window.location.href = payRes.data.payment_url;
        return;
      }

      alert(payRes?.data?.message || 'Không tạo được link thanh toán VNPay');
      setProcessing(false);
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      alert('Có lỗi xảy ra khi kết nối Server.');
      setProcessing(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[60vh] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[60vh]">
      <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-8 border-b pb-4 flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 lg:w-10 lg:h-10 text-indigo-600" />
        Giỏ hàng của bạn
        {totalItems > 0 && (
          <span className="text-2xl text-slate-500 font-normal">({totalItems} sản phẩm)</span>
        )}
      </h1>

      {!cart || cart.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Giỏ hàng đang trống</h2>
          <Link
            href="/product"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-indigo-200"
          >
            Tiếp tục mua sắm <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* --- CỘT TRÁI --- */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 divide-y divide-slate-100">
              {cart.map((item) => {
                const finalPrice = getPrice(item);
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center group hover:bg-slate-50 transition duration-200 relative"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-white border border-slate-200 rounded-lg overflow-hidden relative">
                      <img
                        src={ProductService.getImageUrl(item.thumbnail)}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x100?text=IMG';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.id}`}
                        className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition line-clamp-2 mb-1"
                      >
                        {item.name}
                      </Link>

                      <div className="mb-2">
                        {item.pricesale && item.pricesale > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 font-bold">
                              {(item.pricesale || 0).toLocaleString('vi-VN')}₫
                            </span>
                            <span className="text-sm text-slate-400 line-through">
                              {(item.price || 0).toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-700 font-medium">
                            {(item.price || 0).toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </div>

                      <div className="flex sm:hidden justify-between items-center mt-2">
                        <span className="font-bold text-indigo-600">
                          {((finalPrice || 0) * item.qty).toLocaleString('vi-VN')}₫
                        </span>

                        <div className="flex items-center border border-slate-300 rounded-lg h-8">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.qty - 1))}
                            className="px-2 hover:bg-slate-100 text-slate-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            className="px-2 hover:bg-slate-100 text-slate-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-6">
                      <div className="flex items-center border border-slate-300 rounded-lg h-9">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.qty - 1))}
                          className="px-3 h-full hover:bg-slate-100 text-slate-600 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          className="w-10 text-center outline-none font-medium text-sm bg-transparent"
                          value={item.qty}
                          onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="px-3 h-full hover:bg-slate-100 text-slate-600 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right w-28">
                        <p className="font-bold text-lg text-slate-900">
                          {((finalPrice || 0) * item.qty).toLocaleString('vi-VN')}₫
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-4 right-4 sm:hidden text-slate-300 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link href="/product" className="text-indigo-600 font-medium hover:underline flex items-center gap-1">
                ← Tiếp tục xem sản phẩm
              </Link>
              <button onClick={clearCart} className="text-red-500 text-sm hover:text-red-700 hover:underline">
                Xóa tất cả
              </button>
            </div>
          </div>

          {/* --- CỘT PHẢI --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 sticky top-24">
              <h3 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                Tóm tắt đơn hàng
              </h3>

              {/* ✅ INPUT ĐỊA CHỈ Ở ĐÂY */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Địa chỉ nhận hàng
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    localStorage.setItem('shippingAddress', e.target.value);
                  }}
                  rows={3}
                  placeholder="Nhập địa chỉ giao hàng (VD: 12 Nguyễn Trãi, Q1, TP.HCM)..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                {!shippingAddress.trim() && (
                  <p className="text-xs text-red-500 mt-2">* Vui lòng nhập địa chỉ để thanh toán</p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính:</span>
                  <span className="font-medium">{(cartTotal || 0).toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between py-4 border-t border-dashed border-slate-300 mb-6">
                <span className="text-lg font-bold text-slate-800">Tổng cộng:</span>
                <span className="text-2xl font-extrabold text-indigo-600">{(cartTotal || 0).toLocaleString('vi-VN')}₫</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing || !shippingAddress.trim()}
                className={`w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition duration-300 transform active:scale-[0.98]
                ${processing || !shippingAddress.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:shadow-indigo-200'}`}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'THANH TOÁN VNPAY NGAY'
                )}
              </button>

              <p className="text-xs text-center text-slate-400 mt-4 px-4">
                Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
