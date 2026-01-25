'use client';
import { createContext, useContext, useState, useEffect } from 'react';
const CartContext = createContext();
export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

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


    const cartTotal = cart.reduce((total, item) => {

        const price = (item.pricesale && item.pricesale > 0) ? item.pricesale : (item.price || 0);
        return total + (price * item.qty);
    }, 0); return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
export const useCart = () => useContext(CartContext);