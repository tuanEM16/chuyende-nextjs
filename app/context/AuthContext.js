'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Kiểm tra đăng nhập khi tải trang (Persist login)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Lỗi phân tích dữ liệu user:", error);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    // Hàm Đăng nhập giả lập
    const login = (email, password) => {
        console.log("Đang thử đăng nhập với:", email, password);

        if (email === 'admin@gmail.com' && password === 'admin123') {
            const userData = {
                id: 1,
                name: 'Admin User',
                email: 'admin@gmail.com',
                role: 'admin', // Role admin
                avatar: 'https://i.pravatar.cc/150?u=admin'
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            // TRẢ VỀ ROLE ĐỂ XỬ LÝ REDIRECT
            return { success: true, role: 'admin' }; 
        } 
        
        if (email === 'user@gmail.com' && password === '123456') {
             const userData = {
                id: 2,
                name: 'Khách hàng A',
                email: 'user@gmail.com',
                role: 'user', // Role user
                avatar: 'https://i.pravatar.cc/150?u=user'
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            // TRẢ VỀ ROLE ĐỂ XỬ LÝ REDIRECT
            return { success: true, role: 'user' };
        }

        return { success: false, message: 'Email hoặc mật khẩu không đúng!' };
    };

    // Hàm Đăng xuất
    const logout = () => {
        console.log("Đang đăng xuất...");
        setUser(null);
        localStorage.removeItem('user');
        router.push('/login'); 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
    }
    return context;
};