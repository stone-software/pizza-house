'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { Product } from '@/constants/products';

export function WishlistToggleButton({ product }: { product: Product }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);

    return (
        <button
            onClick={() => toggleWishlist(product)}
            className={`w-20 h-20 flex items-center justify-center rounded-2xl transition-all shadow-xl ${inWishlist
                ? 'bg-gray-900 text-white shadow-gray-900/20'
                : 'bg-gray-100 text-gray-500 hover:bg-white hover:text-primary shadow-gray-100/20'
                }`}
        >
            <Heart size={32} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
    );
}
