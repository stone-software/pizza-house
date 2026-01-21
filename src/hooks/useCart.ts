'use client';

import { useCart as useCartFromContext } from '@/providers/AppProvider';
export type { CartItem } from '@/providers/AppProvider';

export function useCart() {
    return useCartFromContext();
}
