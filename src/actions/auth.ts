'use server';

import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdminAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, error: 'Невірний email або пароль' };
    }

    // Supabase cookies are handled automatically if using @supabase/ssr, 
    // but for simple supabase-js client we might need an additional step 
    // depending on the auth strategy. For now, let's keep it simple.

    return { success: true };
}

export async function logoutAdminAction() {
    await supabase.auth.signOut();
    redirect('/admin/login');
}
