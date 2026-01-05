'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserService from '@/services/UserService'; // Import Service bạn đã tạo

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    // Load user từ localStorage khi F5 trang
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // HÀM LOGIN GỌI API
    const login = async (email, password) => {
        try {
            // Gọi API Login
            const res = await UserService.login(email, password);

            if (res.data.success) {
                const { access_token, data } = res.data;

                // 1. Lưu Token và Info vào LocalStorage
                localStorage.setItem('accessToken', access_token);
                localStorage.setItem('user', JSON.stringify(data));

                // 2. Cập nhật State
                setUser(data);

                // 3. Trả về kết quả cho trang Login xử lý chuyển hướng
                return { success: true, role: data.roles };
            }
        } catch (error) {
            console.error("Login Failed:", error);
            // Trả về lỗi từ Backend (nếu có)
            return { 
                success: false, 
                message: error.response?.data?.message || 'Đăng nhập thất bại' 
            };
        }
    };

    // HÀM LOGOUT
    const logout = () => {
        // Gọi API Logout (không bắt buộc await nếu muốn nhanh)
        UserService.logout().catch(err => console.log(err));
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);