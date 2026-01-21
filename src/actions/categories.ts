'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createCategoryAction(data: { id: string; name: string; icon?: string, sort_order: number }) {
    const { error } = await supabase.from('categories').insert([data]);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/categories');
    return { success: true };
}

export async function updateCategoryAction(id: string, data: any) {
    const { error } = await supabase.from('categories').update(data).eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/categories');
    return { success: true };
}

export async function deleteCategoryAction(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/categories');
    return { success: true };
}
