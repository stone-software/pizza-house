import { supabase } from '@/lib/supabase';

export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    return data;
}

export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data;
}

export async function getProductById(id: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }
    return data;
}

export async function getProductsByCategory(categoryId: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
    return data;
}
