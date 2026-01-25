'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserService from '@/services/UserService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅
  const router = useRouter();


  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await UserService.login(email, password);

      if (res.data.success) {
        const { access_token, data } = res.data;

        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('user', JSON.stringify(data));

        setUser(data);

        return { success: true, role: data.roles };
      }

      return { success: false, message: 'Đăng nhập thất bại' };
    } catch (error) {
      console.error('Login Failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại',
      };
    }
  };

  const logout = () => {
    UserService.logout().catch((err) => console.log(err));

    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,   // ✅
        login,
        logout,
        updateUser,  // ✅ QUAN TRỌNG
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
