'use client';

import { useWishlist as useWishlistFromContext } from '@/providers/AppProvider';

export function useWishlist() {
    return useWishlistFromContext();
}
