'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// --- INLINE SVG COMPONENTS ---
const Icon = ({ path, size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
);
const GridIcon = (props) => <Icon path={["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"]} {...props} />;
const PackageIcon = (props) => <Icon path={["M12 2l10 5.5v11L12 22 2 17.5V7.5L12 2z","M12 22v-9.5","M22 7.5l-10 5.5-10-5.5","M12 12.5l-10-5.5","M12 12.5l10-5.5"]} {...props} />;
const ListIcon = (props) => <Icon path={["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"]} {...props} />;
const TagIcon = (props) => <Icon path={["M12.59 6L9 2.59A1 1 0 0 0 8.29 2H4a2 2 0 0 0-2 2v4.29a1 1 0 0 0 .59.71L12.59 19 22 9.59 12.59 6z","M7 7h.01"]} {...props} />;
const UsersIcon = (props) => <Icon path={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z","M22 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 1 1 0 7.75"]} {...props} />;
const XIcon = (props) => <Icon path={["M18 6L6 18","m6 6l12 12"]} {...props} />;
const MenuIcon = (props) => <Icon path={["M3 12h18","M3 6h18","M3 18h18"]} {...props} />;
const ChevronLeftIcon = (props) => <Icon path={["M15 18l-6-6 6-6"]} {...props} />;
const ChevronRightIcon = (props) => <Icon path={["M9 18l6-6-6-6"]} {...props} />;
const LogOutIcon = (props) => <Icon path={["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","m21 12H9"]} {...props} />;

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleCollapse, logout }) => {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: GridIcon },
        { name: 'Sản phẩm', href: '/admin/product', icon: PackageIcon },
        { name: 'Bài viết', href: '/admin/post', icon: ListIcon },
        { name: 'Danh mục', href: '/admin/category', icon: TagIcon },
        { name: 'Người dùng', href: '/admin/user', icon: UsersIcon },
    ];

    return (
        <aside 
            className={`fixed inset-y-0 left-0 z-30 bg-slate-800 text-white transition-all duration-300 ease-in-out 
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
            ${isCollapsed ? 'w-20' : 'w-64'}
            `}
        >
            <div className="flex flex-col h-full">
                <div className={`flex items-center h-16 px-4 border-b border-slate-700 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && <h2 className="text-xl font-bold text-indigo-400 truncate">Admin Panel</h2>}
                    <button onClick={toggleSidebar} className="text-slate-400 lg:hidden hover:text-white">
                        <XIcon size={24} />
                    </button>
                </div>
                
                <nav className="flex-grow p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            
                            return (
                                <li key={item.name}>
                                    <Link 
                                        href={item.href}
                                        onClick={toggleSidebar}
                                        title={isCollapsed ? item.name : ''}
                                        className={`flex items-center p-3 rounded-lg font-medium transition-all duration-200 
                                        ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                                        ${isCollapsed ? 'justify-center' : 'space-x-3'}
                                        `}
                                    >
                                        <IconComponent size={20} className="flex-shrink-0" />
                                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-slate-700 space-y-2">
                    <button 
                        onClick={toggleCollapse}
                        className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition duration-200"
                    >
                        {isCollapsed ? <ChevronRightIcon size={20} /> : <div className="flex items-center space-x-2"><ChevronLeftIcon size={20} /><span>Thu gọn</span></div>}
                    </button>

                    <button 
                        onClick={() => {
                            if(logout) logout();
                        }} 
                        className={`flex w-full items-center p-2 text-red-400 hover:bg-slate-700 rounded-lg transition duration-200 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                        title="Đăng xuất"
                    >
                        <LogOutIcon size={20} /> 
                        {!isCollapsed && <span className="font-medium truncate">Đăng xuất</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Auth Integration
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    // BẢO VỆ ROUTE: CHỈ ADMIN MỚI ĐƯỢC VÀO
    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                // Chưa đăng nhập -> Về Login
                router.push('/login');
            } else if (user.role !== 'admin') {
                // Có user nhưng role không phải admin -> Về trang chủ
                console.log("Chặn truy cập: User không phải Admin");
                router.push('/');
            }
        }
    }, [user, isLoading, router]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center bg-slate-50 text-indigo-600 font-bold">Đang tải hệ thống...</div>;
    }

    // Nếu không có user hoặc không phải admin, không render giao diện dashboard (tránh lộ nội dung)
    if (!user || user.role !== 'admin') return null;

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                logout={logout}
            />

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={toggleSidebar}></div>
            )}

            <div 
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
                ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} 
                `}
            >
                <header className="bg-white shadow z-10 p-4 lg:p-6 flex items-center justify-between lg:justify-end sticky top-0">
                    <button onClick={toggleSidebar} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden">
                        <MenuIcon size={24} />
                    </button>
                    <div className="flex items-center space-x-4">
                        <span className="text-slate-700 font-medium">Xin chào, {user?.name || 'Admin'}!</span>
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 overflow-hidden">
                            {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : user?.name?.[0]}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8 bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
}