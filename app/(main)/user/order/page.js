'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  XCircle,
  Loader2,
  CreditCard,
  Pencil,
  Save,
  X,
  Ban,
} from 'lucide-react';

import OrderService from '@/services/OrderService';
import ProductService from '@/services/ProductService';
import Link from 'next/link';


import { useCart } from '../../../context/CartContext';

export default function OrderHistoryPage() {
  const router = useRouter();
  const { addToCart ,clearCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [okMsg, setOkMsg] = useState('');


  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editAddress, setEditAddress] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);


  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await OrderService.getHistory();

        if (res?.data?.success) {
          setOrders(Array.isArray(res.data.data) ? res.data.data : []);
        } else {
          setOrders([]);
          setErrorMsg(res?.data?.message || 'Không tải được lịch sử đơn hàng.');
        }
      } catch (error) {
        const status = error?.response?.status;

        if (status === 401) {
          setErrorMsg('Bạn cần đăng nhập để xem lịch sử đơn hàng.');
          setTimeout(() => router.push('/login'), 800);
        } else {
          setErrorMsg(
            error?.response?.data?.message ||
            'Lỗi tải lịch sử (server/CORS). Mở Network để xem /api/order/history.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  const toggleDetail = (id) => {
    setOkMsg('');
    setErrorMsg('');
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };


const handleBuyAgain = (order) => {
  const details = Array.isArray(order?.orderdetails) ? order.orderdetails : [];
  if (details.length === 0) {
    alert('Đơn này không có sản phẩm để mua lại.');
    return;
  }


  if (order?.address) localStorage.setItem('shippingAddress', order.address);


  clearCart();

  const items = details
    .map((d) => {
      const p = d?.product;
      const pid = p?.id ?? d?.product_id;
      if (!pid) return null;

      return {
        id: pid,
        name: p?.name || 'Sản phẩm',
        thumbnail: p?.thumbnail || p?.image || '',
        price: Number(d?.price ?? p?.price ?? 0),
        pricesale: Number(p?.pricesale ?? 0),
        qty: Number(d?.qty ?? 1),
      };
    })
    .filter(Boolean);


  items.forEach((it) => {
    const q = Number.isFinite(it.qty) && it.qty > 0 ? it.qty : 1;
    addToCart(
      {
        id: it.id,
        name: it.name,
        thumbnail: it.thumbnail,
        price: it.price,
        pricesale: it.pricesale,
      },
      q
    );
  });

  router.push('/cart');
};



  const getStatusBadge = (status) => {
    const s = Number(status);

    switch (s) {
      case 1:
        return (
          <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
            <Clock size={14} /> Chờ thanh toán
          </span>
        );
      case 2:
        return (
          <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
            <CreditCard size={14} /> Đã thanh toán
          </span>
        );
      case 3:
        return (
          <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
            <XCircle size={14} /> Thất bại
          </span>
        );
      case 4:
      default:
        return (
          <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
            <XCircle size={14} /> Đã hủy
          </span>
        );
    }
  };

  const calculateTotal = (details) => {
    if (!Array.isArray(details)) return 0;
    return details.reduce((sum, item) => {
      const price = Number(item?.price ?? 0);
      const qty = Number(item?.qty ?? 0);
      const amount = item?.amount != null ? Number(item.amount) : price * qty;
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  };


  const startEditAddress = (order) => {
    setOkMsg('');
    setErrorMsg('');
    setEditingOrderId(order.id);
    setEditAddress(order?.address || '');
    if (expandedOrderId !== order.id) setExpandedOrderId(order.id);
  };

  const cancelEditAddress = () => {
    setEditingOrderId(null);
    setEditAddress('');
  };

  const saveAddress = async (orderId) => {
    const addr = (editAddress || '').trim();
    if (!addr) {
      setErrorMsg('Địa chỉ không được để trống.');
      return;
    }

    setSavingAddress(true);
    setOkMsg('');
    setErrorMsg('');
    try {
      const res = await OrderService.updateAddress(orderId, { address: addr });

      if (!res?.data?.success) {
        setErrorMsg(res?.data?.message || 'Cập nhật địa chỉ thất bại.');
        return;
      }

      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, address: addr } : o)));

      setOkMsg('Cập nhật địa chỉ thành công ✅');
      setEditingOrderId(null);
      setEditAddress('');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setErrorMsg('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => router.push('/login'), 800);
      } else {
        setErrorMsg(err?.response?.data?.message || 'Lỗi server khi cập nhật địa chỉ.');
      }
    } finally {
      setSavingAddress(false);
    }
  };


  const cancelOrder = async (orderId) => {
    const ok = window.confirm('Hủy đơn hàng này?');
    if (!ok) return;

    setCancelingId(orderId);
    setOkMsg('');
    setErrorMsg('');
    try {
      const res = await OrderService.cancel(orderId);

      if (!res?.data?.success) {
        setErrorMsg(res?.data?.message || 'Hủy đơn hàng thất bại.');
        return;
      }

      const newStatus = res?.data?.data?.status ?? 4;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

      if (editingOrderId === orderId) cancelEditAddress();

      setOkMsg('Đã hủy đơn hàng ✅');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setErrorMsg('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => router.push('/login'), 800);
      } else {
        setErrorMsg(err?.response?.data?.message || 'Lỗi server khi hủy đơn.');
      }
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (errorMsg && orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 min-h-[60vh]">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 mb-2">Không tải được lịch sử</h1>
          <p className="text-slate-600">{errorMsg}</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
            >
              Tải lại
            </button>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-[60vh]">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Package className="text-indigo-600" /> Lịch sử đơn hàng
      </h1>

      {(errorMsg || okMsg) && (
        <div className="mb-4">
          {errorMsg && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
              {errorMsg}
            </div>
          )}
          {okMsg && (
            <div className="p-3 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm">
              {okMsg}
            </div>
          )}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow border border-slate-200">
          <p className="text-slate-500 mb-4">Bạn chưa có đơn hàng nào.</p>
          <Link href="/product" className="text-indigo-600 font-bold hover:underline">
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const details = Array.isArray(order?.orderdetails) ? order.orderdetails : [];
            const total = calculateTotal(details);
            const isPending = Number(order.status) === 1;
            const isEditing = editingOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition hover:shadow-md"
              >
                <div
                  onClick={() => toggleDetail(order.id)}
                  className="p-4 sm:p-6 cursor-pointer bg-slate-50 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-slate-800">#{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '---'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Tổng tiền</p>
                      <p className="font-bold text-indigo-600 text-lg">{total.toLocaleString('vi-VN')}₫</p>
                    </div>
                    {expandedOrderId === order.id ? (
                      <ChevronUp className="text-slate-400" />
                    ) : (
                      <ChevronDown className="text-slate-400" />
                    )}
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className="p-4 sm:p-6 border-t border-slate-100 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm bg-slate-50 p-4 rounded-lg">
                      <div>
                        <p className="text-slate-500">Người nhận:</p>
                        <p className="font-medium">{order.name || '---'}</p>
                        <p className="font-medium">{order.phone || '---'}</p>
                      </div>

                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-slate-500">Địa chỉ:</p>

                            {!isEditing ? (
                              <p className="font-medium">{order.address || '---'}</p>
                            ) : (
                              <div className="mt-1 space-y-2">
                                <input
                                  value={editAddress}
                                  onChange={(e) => setEditAddress(e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                  placeholder="Nhập địa chỉ giao hàng..."
                                />
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => saveAddress(order.id)}
                                    disabled={savingAddress}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-60"
                                  >
                                    {savingAddress ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Đang lưu
                                      </>
                                    ) : (
                                      <>
                                        <Save className="w-4 h-4" />
                                        Lưu
                                      </>
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={cancelEditAddress}
                                    disabled={savingAddress}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 disabled:opacity-60"
                                  >
                                    <X className="w-4 h-4" />
                                    Hủy
                                  </button>
                                </div>
                                <p className="text-xs text-slate-500">
                                  Chỉ cho sửa khi <b>chờ thanh toán (status=1)</b>.
                                </p>
                              </div>
                            )}

                            {order.note && (
                              <p className="text-slate-500 italic mt-1">"Ghi chú: {order.note}"</p>
                            )}
                          </div>

                          {isPending && !isEditing && (
                            <button
                              type="button"
                              onClick={() => startEditAddress(order)}
                              className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100"
                              title="Sửa địa chỉ"
                            >
                              <Pencil className="w-4 h-4" />
                              Sửa
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-700 mb-3 text-sm">Sản phẩm ({details.length})</h4>

                    <div className="space-y-3">
                      {details.map((detail, index) => {
                        const qty = Number(detail?.qty ?? 0);
                        const price = Number(detail?.price ?? 0);

                        return (
                          <div
                            key={detail?.id ?? index}
                            className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0"
                          >
                            <div className="w-16 h-16 border rounded bg-white flex-shrink-0 overflow-hidden">
                              <img
                                alt={detail?.product?.name || 'product'}
                                src={ProductService.getImageUrl(detail?.product?.image || detail?.product?.thumbnail)}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://placehold.co/100x100?text=IMG';
                                }}
                              />
                            </div>

                            <div className="flex-1">
                              <p className="font-medium text-slate-800 line-clamp-1">
                                {detail?.product?.name || 'Sản phẩm đã xóa'}
                              </p>
                              <p className="text-xs text-slate-500">x{qty}</p>
                            </div>

                            <div className="font-medium text-slate-700">{(price * qty).toLocaleString('vi-VN')}₫</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ✅ ACTIONS */}
                    <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-3 justify-end">
                      {/* ✅ Mua lại luôn hiện */}
                      <button
                        type="button"
                        onClick={() => handleBuyAgain(order)}
                        className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                      >
                        Mua lại
                      </button>

                      {/* ✅ Pending mới được sửa & hủy */}
                      {isPending && (
                        <>
                          {!isEditing && (
                            <button
                              type="button"
                              onClick={() => startEditAddress(order)}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100"
                            >
                              <Pencil className="w-4 h-4" />
                              Sửa địa chỉ
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => cancelOrder(order.id)}
                            disabled={cancelingId === order.id}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-60"
                          >
                            {cancelingId === order.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang hủy...
                              </>
                            ) : (
                              <>
                                <Ban className="w-4 h-4" />
                                Hủy đơn hàng
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
