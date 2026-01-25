'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart, CartProvider } from '../context/CartContext';

// 1. ĐỊNH NGHĨA LOGOICON Ở ĐÂY (TRƯỚC KHI DÙNG TRONG HEADER)
const LogoIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-8 h-8 md:w-9 md:h-9"
  >
    <rect x="2" y="2" width="9" height="9" rx="1.5" className="fill-indigo-600" />
    <rect x="13" y="2" width="9" height="9" rx="1.5" className="fill-indigo-400" />
    <rect x="2" y="13" width="9" height="9" rx="1.5" className="fill-indigo-500" />
    <rect x="13" y="13" width="9" height="9" rx="1.5" className="fill-orange-400" /> 
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 5c.07.286.074.58.012.868-.053.243-.136.471-.246.682a3.75 3.75 0 0 1-3.326 2.143h-10.8a3.75 3.75 0 0 1-3.326-2.143 3.75 3.75 0 0 1 .234-1.55c.06-.288.066-.582.016-.869l1.26-5a3.75 3.75 0 0 1 3.712-2.903h9.32a3.75 3.75 0 0 1 3.712 2.903ZM6.75 10.5v-.75" />
  </svg>
);

const Header = () => {
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = cart ? cart.reduce((total, item) => total + (item.qty || 0), 0) : 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        {/* LOGO & BRAND */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="transition-transform duration-300 group-hover:rotate-12">
            <LogoIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black leading-none tracking-tight bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
              ShopGachMen
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">
              Gạch Men Cao Cấp
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/product" className="text-slate-600 hover:text-indigo-600 font-medium transition duration-300">
            Sản phẩm
          </Link>
          <Link href="/post" className="text-slate-600 hover:text-indigo-600 font-medium transition duration-300">
            Blog
          </Link>
          
          <Link href="/cart" className="group flex items-center space-x-1 text-slate-600 hover:text-indigo-600 font-medium transition duration-300 relative">
            <span className="group-hover:scale-110 transition-transform relative">
                <CartIcon />
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
          
          <Link href="/dashboard" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-100">
            Dashboard
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-slate-600 relative p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            {isMounted && cartCount > 0 && (
               <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500"></span>
            )}
        </button>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} ShopGachMen. All rights reserved.</p>
        <div className="flex space-x-6 text-sm font-medium">
          <a href="#" className="hover:text-white transition">Chính sách bảo mật</a>
          <a href="#" className="hover:text-white transition">Điều khoản sử dụng</a>
          <a href="#" className="hover:text-white transition">Liên hệ</a>
        </div>
      </div>
    </div>
  </footer>
);

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