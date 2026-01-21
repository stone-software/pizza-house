'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/constants/products';

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isInitialized: boolean;
}

interface WishlistContextType {
    wishlist: Product[];
    toggleWishlist: (product: Product) => void;
    isInWishlist: (productId: string) => boolean;
    isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isCartInitialized, setIsCartInitialized] = useState(false);
    const [isWishlistInitialized, setIsWishlistInitialized] = useState(false);

    // Initialize from LocalStorage
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) setCart(JSON.parse(savedCart));

            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        } catch (e) {
            console.error('Failed to load storage', e);
        }
        setIsCartInitialized(true);
        setIsWishlistInitialized(true);
    }, []);

    // Sync to LocalStorage
    useEffect(() => {
        if (isCartInitialized) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isCartInitialized]);

    useEffect(() => {
        if (isWishlistInitialized) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isWishlistInitialized]);

    // Cart Actions
    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart((prev) =>
            prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.discount_price || item.price) * item.quantity, 0);

    // Wishlist Actions
    const toggleWishlist = (product: Product) => {
        setWishlist((prev) => {
            const isExist = prev.some((item) => item.id === product.id);
            if (isExist) {
                return prev.filter((item) => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((item) => item.id === productId);
    };

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isInitialized: isCartInitialized
        }}>
            <WishlistContext.Provider value={{
                wishlist, toggleWishlist, isInWishlist, isInitialized: isWishlistInitialized
            }}>
                {children}
            </WishlistContext.Provider>
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within an AppProvider');
    }
    return context;
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within an AppProvider');
    }
    return context;
}
