'use client';

import Link from 'next/link';

// Component Header
const Header = () => (
  <header className="bg-white shadow-md sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-slate-800 hover:text-indigo-600 transition duration-300">
        CommerceBlog
      </Link>
      <nav className="hidden md:flex space-x-8">
        <Link href="/product" className="text-slate-600 hover:text-indigo-600 font-medium transition duration-300">Sản phẩm</Link>
        <Link href="/post" className="text-slate-600 hover:text-indigo-600 font-medium transition duration-300">Blog</Link>
        <Link href="/cart" className="text-slate-600 hover:text-indigo-600 font-medium transition duration-300">Giỏ hàng</Link>
        <Link href="/user" className="text-slate-600 hover:text-indigo-600 font-medium transition duration-300">Tài khoản</Link>
        <Link href="/dashboard" className="text-indigo-500 hover:text-indigo-700 font-semibold transition duration-300 border-l pl-8 ml-4">Dashboard</Link>
      </nav>
      {/* Mobile Menu Icon would be here */}
    </div>
  </header>
);

// Component Footer
const Footer = () => (
  <footer className="bg-slate-800 text-white mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} CommerceBlog. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="#" className="hover:text-indigo-400">Chính sách bảo mật</a>
        <a href="#" className="hover:text-indigo-400">Điều khoản sử dụng</a>
      </div>
    </div>
  </footer>
);

// Layout chính
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}