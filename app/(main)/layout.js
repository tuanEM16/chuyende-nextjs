'use client';

import Link from 'next/link';
// 👇 1. IMPORT THÊM useState, useEffect
import { useState, useEffect } from 'react';
import { useCart, CartProvider } from '../context/CartContext';

// Icon Giỏ hàng
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 5c.07.286.074.58.012.868-.053.243-.136.471-.246.682a3.75 3.75 0 0 1-3.326 2.143h-10.8a3.75 3.75 0 0 1-3.326-2.143 3.75 3.75 0 0 1 .234-1.55c.06-.288.066-.582.016-.869l1.26-5a3.75 3.75 0 0 1 3.712-2.903h9.32a3.75 3.75 0 0 1 3.712 2.903ZM6.75 10.5v-.75" />
  </svg>
);

// Component Header
const Header = () => {
  const { cart } = useCart();
  
  // 👇 2. KHAI BÁO STATE ĐỂ CHECK MOUNTED
  const [isMounted, setIsMounted] = useState(false);

  // 👇 3. USE EFFECT ĐỂ XÁC NHẬN ĐÃ Ở CLIENT
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = cart ? cart.reduce((total, item) => total + (item.qty || 0), 0) : 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight hover:opacity-80 transition">
          CommerceBlog
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/product" className="text-slate-600 hover:text-indigo-600 font-medium transition duration-300">
            Sản phẩm
          </Link>
          <Link href="/post" className="text-slate-600 hover:text-indigo-600 font-medium transition duration-300">
            Blog
          </Link>
          
          {/* Link Giỏ hàng */}
          <Link href="/cart" className="group flex items-center space-x-1 text-slate-600 hover:text-indigo-600 font-medium transition duration-300 relative">
            <span className="group-hover:scale-110 transition-transform relative">
                <CartIcon />
                
                {/* 👇 4. THÊM ĐIỀU KIỆN 'isMounted &&' ĐỂ TRÁNH LỖI HYDRATION */}
                {isMounted && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white shadow-sm flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
            </span>
            <span>Giỏ hàng</span>
          </Link>

          <Link href="/user" className="text-slate-600 hover:text-indigo-600 font-medium transition duration-300">
            Tài khoản
          </Link>
          
          <Link href="/dashboard" className="text-indigo-500 hover:text-indigo-700 font-semibold transition duration-300 border-l border-slate-300 pl-6 ml-2">
            Dashboard
          </Link>
        </nav>

        <button className="md:hidden text-slate-600 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            
            {/* Cũng thêm isMounted ở đây cho mobile */}
            {isMounted && cartCount > 0 && (
               <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
            )}
        </button>
      </div>
    </header>
  );
};

// Component Footer (Giữ nguyên)
const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} CommerceBlog. All rights reserved.</p>
        <div className="flex space-x-6 text-sm font-medium">
          <a href="#" className="hover:text-white transition">Chính sách bảo mật</a>
          <a href="#" className="hover:text-white transition">Điều khoản sử dụng</a>
          <a href="#" className="hover:text-white transition">Liên hệ</a>
        </div>
      </div>
    </div>
  </footer>
);

// Layout chính
export default function MainLayout({ children }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
        <Header />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}