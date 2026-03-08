'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedOptions: Record<string, string>;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, options: Record<string, string>) => void;
    removeFromCart: (id: string, options: Record<string, string>) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any, selectedOptions: Record<string, string>) => {
        setCart(prev => {
            const existingItem = prev.find(item =>
                item.id === product.id &&
                JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
            );

            if (existingItem) {
                return prev.map(item =>
                    item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.images[0],
                selectedOptions
            }];
        });
    };

    const removeFromCart = (id: string, selectedOptions: Record<string, string>) => {
        setCart(prev => prev.filter(item =>
            !(item.id === id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
        ));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
