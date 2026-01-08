'use client';
import { createContext, useContext, useState, useEffect } from 'react';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
    // Khởi tạo giỏ hàng từ localStorage (nếu có)
    const [cart, setCart] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });
    // Lưu vào localStorage mỗi khi cart thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
    // --- 1. SỬA LỖI LOGIC THÊM GIỎ HÀNG ---
    const addToCart = (product, quantity = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + quantity }
                        : item
                );
            }

            return [...prevCart, { ...product, qty: quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };
    const updateQuantity = (productId, newQty) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, qty: newQty } : item
            )
        );
    };
    const clearCart = () => setCart([]);
    // --- 2. SỬA LỖI TÍNH TỔNG TIỀN (Ưu tiên giá sale) ---
    // Trong hàm cartTotal
    const cartTotal = cart.reduce((total, item) => {
        // Thêm || 0 vào các giá trị lấy ra
        const price = (item.pricesale && item.pricesale > 0) ? item.pricesale : (item.price || 0);
        return total + (price * item.qty);
    }, 0); return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
export const useCart = () => useContext(CartContext);