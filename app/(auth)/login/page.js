'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Đảm bảo đường dẫn đúng
import { useRouter } from 'next/navigation';

// Icons giữ nguyên
const LockIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const MailIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>;

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Thêm state loading
    
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => { // Thêm async
        e.preventDefault();
        setError('');
        setLoading(true); // Bắt đầu loading
        
        try {
            // Gọi hàm login từ AuthContext (đã sửa để gọi API)
            const result = await login(email, password);
            console.log("Role nhận được:", result.role);
            if (result && result.success) {
                // LOGIC CHUYỂN HƯỚNG DỰA TRÊN ROLE TỪ API
                if (result.role === 'admin') {
                    router.push('/dashboard'); // Sửa đường dẫn admin cho chuẩn
                } else {
                    router.push('/'); 
                }
            } else {
                setError(result?.message || 'Có lỗi xảy ra');
            }
        } catch (err) {
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false); // Tắt loading
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Chào mừng trở lại!</h1>
                    <p className="text-slate-500 mt-2">Vui lòng đăng nhập để tiếp tục</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <MailIcon />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                placeholder="admin@gmail.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <LockIcon />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                placeholder="••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
                
                <div className="mt-6 p-4 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-200">
                    <p className="font-bold mb-1">Tài khoản test (trong DB):</p>
                    <p>Đảm bảo bạn đã tạo user trong DB thông qua Postman hoặc Seeder.</p>
                </div>
            </div>
        </div>
    );
}