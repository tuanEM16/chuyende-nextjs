'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// --- INLINE SVG ICONS (Bổ sung đầy đủ) ---
const Icon = ({ path, size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
);

// 1. Dashboard & System
const GridIcon = (props) => <Icon path={["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"]} {...props} />;
const SettingsIcon = (props) => <Icon path={["M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.18-.08a2 2 0 0 0-2 0l-.45.45a2 2 0 0 0 0 2l.08.18a2 2 0 0 1 0 2l-.25.43a2 2 0 0 1-1.73 1l-.18.08a2 2 0 0 0 0 2v.44a2 2 0 0 0 0 2v.18a2 2 0 0 1 0 2l.08.18a2 2 0 0 0 0 2l.45.45a2 2 0 0 0 2 0l.18-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1.73 1v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.18.08a2 2 0 0 0 2 0l.45-.45a2 2 0 0 0 0-2l-.08-.18a2 2 0 0 1 0-2l.25-.43a2 2 0 0 1-1.73-1l.18-.08a2 2 0 0 0 0-2v-.44a2 2 0 0 0 0-2v-.18a2 2 0 0 1 0-2l-.08-.18a2 2 0 0 0 0-2l-.45-.45a2 2 0 0 0-2 0l-.18.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1.73-1v-.18a2 2 0 0 0-2-2z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} {...props} />;
const MenuIcon = (props) => <Icon path={["M3 12h18", "M3 6h18", "M3 18h18"]} {...props} />;
const ImageIcon = (props) => <Icon path={["M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z", "m8.5 10 2.5 2.5L15.5 8 21 13.5V19H3v-5.5l5.5-5.5z"]} {...props} />;

// 2. Product Management
const PackageIcon = (props) => <Icon path={["M16.5 9.4 7.55 4.24", "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.29 7 12 12.01 20.71 7", "M12 12v10.06"]} {...props} />;
const LayersIcon = (props) => <Icon path={["M12 2 2 7l10 5 10-5-10-5z", "m2 17 10 5 10-5", "m2 12 10 5 10-5"]} {...props} />;
const SlidersIcon = (props) => <Icon path={["M4 21v-7", "M4 10V3", "M12 21v-9", "M12 8V3", "M20 21v-5", "M20 12V3", "M1 14h6", "M9 8h6", "M17 16h6"]} {...props} />;
const PercentIcon = (props) => <Icon path={["M19 5L5 19", "M6.5 6.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4", "M17.5 13.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4"]} {...props} />;
const ArchiveIcon = (props) => <Icon path={["M21 8v13H3V8", "M1 3h22v5H1z", "M10 12h4"]} {...props} />;

// 3. Order & Customer
const ShoppingCartIcon = (props) => <Icon path={["M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", "M3 6h18", "M16 10a4 4 0 0 1-8 0"]} {...props} />;
const UsersIcon = (props) => <Icon path={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 1 1 0 7.75"]} {...props} />;
const MailIcon = (props) => <Icon path={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "m22 6-10 7L2 6"]} {...props} />;

// 4. Content
const FileTextIcon = (props) => <Icon path={["M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]} {...props} />;
const TagIcon = (props) => <Icon path={["M12.59 6L9 2.59A1 1 0 0 0 8.29 2H4a2 2 0 0 0-2 2v4.29a1 1 0 0 0 .59.71L12.59 19 22 9.59 12.59 6z", "M7 7h.01"]} {...props} />;

// UI Utils
const XIcon = (props) => <Icon path={["M18 6L6 18", "m6 6l12 12"]} {...props} />;
const ListIcon = (props) => <Icon path={["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]} {...props} />;
const ChevronLeftIcon = (props) => <Icon path={["M15 18l-6-6 6-6"]} {...props} />;
const ChevronRightIcon = (props) => <Icon path={["M9 18l6-6-6-6"]} {...props} />;
const LogOutIcon = (props) => <Icon path={["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "m21 12H9"]} {...props} />;

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleCollapse, logout }) => {
    const pathname = usePathname();

    // --- DANH SÁCH MENU ĐẦY ĐỦ CÁC BẢNG TRONG CDTT.SQL ---
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: GridIcon },

        // Nhóm Sản phẩm
        { name: 'Sản phẩm', href: '/admin/product', icon: PackageIcon },
        { name: 'Danh mục', href: '/admin/category', icon: LayersIcon },
        { name: 'Thuộc tính', href: '/admin/attribute', icon: SlidersIcon },
        { name: 'Khuyến mãi', href: '/admin/productsale', icon: PercentIcon },
        { name: 'Nhập kho', href: '/admin/productstore', icon: ArchiveIcon },
        { name: 'Thư viện Ảnh', href: '/admin/productimage', icon: ImageIcon },
        { name: 'Thuộc tính SP', href: '/admin/productattribute', icon: TagIcon },
        
        // Nhóm Bán hàng
        { name: 'Đơn hàng', href: '/admin/order', icon: ShoppingCartIcon },
        { name: 'Khách hàng', href: '/admin/user', icon: UsersIcon },
        { name: 'Liên hệ', href: '/admin/contact', icon: MailIcon },

        // Nhóm Nội dung
        { name: 'Bài viết', href: '/admin/post', icon: FileTextIcon },
        { name: 'Chủ đề', href: '/admin/topic', icon: TagIcon },
        { name: 'Banner', href: '/admin/banner', icon: ImageIcon },

        // Nhóm Cấu hình
        { name: 'Menu', href: '/admin/menu', icon: ListIcon },
        { name: 'Cấu hình', href: '/admin/config', icon: SettingsIcon },
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-30 bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out shadow-xl
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
            ${isCollapsed ? 'w-20' : 'w-64'}
            `}
        >
            <div className="flex flex-col h-full">
                {/* Header Sidebar */}
                <div className={`flex items-center h-16 px-4 bg-slate-950 border-b border-slate-800 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && (
                        <Link href="/dashboard" className="flex items-center space-x-2 group">
                            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition">
                                <GridIcon size={20} className="text-white" />
                            </div>
                            <span className="text-lg font-bold text-white tracking-wide">AdminPanel</span>
                        </Link>
                    )}
                    <button onClick={toggleSidebar} className="text-slate-400 lg:hidden hover:text-white transition">
                        <XIcon size={24} />
                    </button>
                </div>

                {/* Menu List */}
                <nav className="flex-grow p-3 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                        title={isCollapsed ? item.name : ''}
                                        className={`flex items-center px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group
                                        ${isActive
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                                        ${isCollapsed ? 'justify-center' : 'space-x-3'}
                                        `}
                                    >
                                        <IconComponent
                                            size={20}
                                            className={`flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}
                                        />
                                        {!isCollapsed && <span className="truncate text-sm">{item.name}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2">
                    <button
                        onClick={toggleCollapse}
                        className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition duration-200"
                    >
                        {isCollapsed ? <ChevronRightIcon size={20} /> : <div className="flex items-center space-x-2"><ChevronLeftIcon size={20} /><span className="text-xs uppercase font-bold tracking-wider">Thu gọn</span></div>}
                    </button>

                    <button
                        onClick={() => {
                            if (logout) logout();
                        }}
                        className={`flex w-full items-center p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition duration-200 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                        title="Đăng xuất"
                    >
                        <LogOutIcon size={20} />
                        {!isCollapsed && <span className="font-medium truncate text-sm">Đăng xuất</span>}
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
                router.push('/login');
            } else {
                const currentRole = user.roles || user.role;
                if (currentRole !== 'admin') {
                    console.log("Chặn truy cập: User không phải Admin");
                    router.push('/');
                }
            }
        }
    }, [user, isLoading, router]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    <span className="text-indigo-600 font-medium">Đang tải hệ thống...</span>
                </div>
            </div>
        );
    }

    const currentRole = user?.roles || user?.role;
    if (!user || currentRole !== 'admin') return null;

    return (
        <div className="flex h-screen bg-slate-100 font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                logout={logout}
            />

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden" onClick={toggleSidebar}></div>
            )}

            <div
                className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out
                ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} 
                `}
            >
                <header className="bg-white shadow-sm z-10 px-6 py-3 flex items-center justify-between lg:justify-end sticky top-0 h-16">
                    <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden">
                        <MenuIcon size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-semibold text-slate-800">{user?.name || 'Administrator'}</div>
                            <div className="text-xs text-slate-500 capitalize">{user?.roles || 'Admin'}</div>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 overflow-hidden shadow-sm">
                            {user?.avatar ?
                                <img src={user.avatar.startsWith('http') ? user.avatar : `http://127.0.0.1:8000/images/user/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                                : (user?.name?.[0] || 'A')
                            }
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}