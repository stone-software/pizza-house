'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/constants/products';

export function AddToCartButton({ product }: { product: Product }) {
    const { addToCart, cart } = useCart();
    const inCart = cart.some(item => item.id === product.id);

    return (
        <button
            onClick={() => !inCart && addToCart(product)}
            disabled={inCart}
            className={`flex-grow h-20 flex items-center justify-center gap-3 rounded-2xl font-black text-xl transition-all shadow-xl ${inCart
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark hover:scale-[1.02] active:scale-95 shadow-primary/20'
                }`}
        >
            {inCart ? (
                'ВЖЕ В КОШИКУ'
            ) : (
                <>
                    <ShoppingBag size={24} />
                    <span>ДОДАТИ В КОШИК</span>
                </>
            )}
        </button>
    );
}
