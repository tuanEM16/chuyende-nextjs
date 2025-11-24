'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

// --- INLINE SVG COMPONENTS (Thay thế lucide-react) ---
const Icon = ({ path, size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
);
const MailIcon = (props) => <Icon path={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","m22 6-10 7L2 6"]} {...props} />;
const UserIcon = (props) => <Icon path={["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2","M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]} {...props} />;
const LogOutIcon = (props) => <Icon path={["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","m21 12H9"]} {...props} />;
const SettingsIcon = (props) => <Icon path={["M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.09a2 2 0 0 0-2.73.73l-.26.43a2 2 0 0 0 .73 2.73l.43.25a2 2 0 0 1 0 1.74l-.43.25a2 2 0 0 0-.73 2.73l.26.43a2 2 0 0 0 2.73.73l.15-.09a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.09a2 2 0 0 0 2.73-.73l.26-.43a2 2 0 0 0-.73-2.73l-.43-.25a2 2 0 0 1 0-1.74l.43-.25a2 2 0 0 1 .73-2.73l-.26-.43a2 2 0 0 0-2.73-.73l-.15.09a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"]} {...props} />;
const HomeIcon = (props) => <Icon path={["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "9 22 9 12 15 12 15 22"]} {...props} />;
// --- END INLINE SVG COMPONENTS ---

export default function UserPage() {
    const { user, logout, isLoading } = useAuth(); 
    const router = useRouter();

    // Bảo vệ route: Nếu chưa login (và đã load xong), tự động chuyển về trang Login
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    // Hiển thị trạng thái đang tải hoặc trống nếu chưa có user
    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-indigo-600 font-medium">Đang tải hồ sơ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-between mb-8 border-b pb-3">
                <h1 className="text-4xl font-extrabold text-slate-900">Hồ sơ Cá nhân</h1>
                <Link href="/" className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors group">
                    <HomeIcon size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                    Về trang chủ
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-2xl p-8 space-y-8">
                {/* Thông tin cơ bản */}
                <div className="flex items-center space-x-6 border-b pb-6">
                    <div className="h-20 w-20 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 text-3xl font-bold overflow-hidden border-2 border-indigo-100">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            user.name[0]
                        )}
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-800">{user.name}</p>
                        <div className="flex items-center space-x-3 mt-1">
                            <p className="text-slate-500 flex items-center space-x-1">
                                <MailIcon size={16} /> 
                                <span>{user.email}</span>
                            </p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chi tiết và Thống kê */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-lg shadow-inner border border-slate-100">
                        <h3 className="text-xl font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                            <SettingsIcon size={20} />
                            <span>Thiết lập</span>
                        </h3>
                        <ul className="space-y-2 text-slate-600">
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors duration-200 flex items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></span>
                                Chỉnh sửa thông tin
                            </li>
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors duration-200 flex items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></span>
                                Thay đổi mật khẩu
                            </li>
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors duration-200 flex items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></span>
                                Địa chỉ giao hàng
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-lg shadow-inner border border-slate-100">
                        <h3 className="text-xl font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                            <UserIcon size={20} />
                            <span>Hoạt động</span>
                        </h3>
                        <p className="text-slate-600 mb-2">Thành viên từ: <span className="font-medium text-slate-800">Tháng 10, 2023</span></p>
                        <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-200 underline underline-offset-2">
                            Xem lịch sử đơn hàng
                        </button>
                    </div>
                </div>

                {/* Đăng xuất */}
                <div className="pt-6 border-t border-slate-100">
                    <button 
                        onClick={logout}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-800 font-semibold transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                        <LogOutIcon size={20} /> 
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
        </div>
    );
}