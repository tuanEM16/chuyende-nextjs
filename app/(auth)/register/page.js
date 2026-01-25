'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/AuthService'; // Đảm bảo bạn đã có AuthService
import { User, Mail, Lock, Phone, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg(''); // Xóa lỗi khi nhập lại
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        

        if (formData.password !== formData.password_confirmation) {
            setErrorMsg("Mật khẩu nhập lại không khớp!");
            return;
        }
        if (formData.password.length < 6) {
            setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setLoading(true);
        try {


            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            };

            const res = await AuthService.register(payload);


            if (res.data && res.data.success) {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                router.push('/login');
            } else {

                const msg = res.data.message || "Đăng ký thất bại.";

                if (res.data.errors) {
                    const firstError = Object.values(res.data.errors)[0][0]; // Lấy lỗi đầu tiên
                    setErrorMsg(firstError);
                } else {
                    setErrorMsg(msg);
                }
            }
        } catch (error) {
            console.error("Register Error:", error);

            if (error.response && error.response.data) {
                const data = error.response.data;
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0][0];
                    setErrorMsg(firstError);
                } else {
                    setErrorMsg(data.message || "Lỗi kết nối server.");
                }
            } else {
                setErrorMsg("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-8">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800">Tạo tài khoản</h1>
                    <p className="text-slate-500 mt-2">Tham gia cùng chúng tôi ngay hôm nay</p>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    {/* Họ tên */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                                placeholder="Nguyễn Văn A"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="text" name="phone"
                                value={formData.phone} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                                placeholder="09xxxx (Tùy chọn)"
                            />
                        </div>
                    </div>

                    {/* Mật khẩu */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="password" name="password" required minLength={6}
                                value={formData.password} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                                placeholder="Ít nhất 6 ký tự"
                            />
                        </div>
                    </div>

                    {/* Nhập lại mật khẩu */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nhập lại mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="password" name="password_confirmation" required
                                value={formData.password_confirmation} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                                placeholder="Xác nhận mật khẩu"
                            />
                        </div>
                    </div>

                    {/* Nút đăng ký */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-indigo-500/30 transition transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Đăng ký ngay <ArrowRight className="h-5 w-5" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-600">
                    Bạn đã có tài khoản?{' '}
                    <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                        Đăng nhập tại đây
                    </Link>
                </div>
            </div>
        </div>
    );
}