import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function CartPage() {
    // Tạm thời hiển thị giỏ hàng trống
    const cartItems = []; 
    const totalAmount = 0;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-8 border-b pb-3">Giỏ hàng của bạn</h1>

            {cartItems.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-dashed border-slate-300">
                    <ShoppingCart className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Giỏ hàng trống</h2>
                    <p className="text-slate-500 mb-6">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
                    <Link href="/product" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition duration-300 shadow-md">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột sản phẩm (chưa implement) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <p className="text-slate-600">Sản phẩm trong giỏ hàng sẽ được liệt kê tại đây.</p>
                        </div>
                    </div>
                    
                    {/* Cột Tóm tắt */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-24">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Tóm tắt đơn hàng</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-slate-600">
                                <span>Tạm tính:</span>
                                <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Phí vận chuyển:</span>
                                <span>0₫</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-slate-200 text-2xl font-bold text-indigo-600">
                                <span>Tổng cộng:</span>
                                <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition duration-300">
                            Tiến hành thanh toán
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}