'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createProductAction(data: any) {
    const { error } = await supabase.from('products').insert([data]);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
}

export async function updateProductAction(id: string, data: any) {
    const { error } = await supabase.from('products').update(data).eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
}

export async function deleteProductAction(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
}

export async function toggleProductActionStatus(id: string, isAction: boolean) {
    const { error } = await supabase.from('products').update({ is_action: isAction }).eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
}
