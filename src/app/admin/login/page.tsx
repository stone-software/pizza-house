'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Container } from '@/components/ui/Container';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (!authError) {
            router.push('/admin/dashboard');
            router.refresh();
        } else {
            setError('Невірний email або пароль');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Container className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                        Вхід в <span className="text-primary">Admin Panel</span>
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 font-medium">
                        Тільки для авторизованих користувачів
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="shadow-lg shadow-gray-200/50 border border-gray-200 rounded-2xl overflow-hidden bg-white divide-y divide-gray-100">
                        <input
                            name="email"
                            type="email"
                            required
                            className="block w-full px-5 py-4 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-gray-50/50 transition-all sm:text-sm font-medium"
                            placeholder="Email"
                        />
                        <input
                            name="password"
                            type="password"
                            required
                            className="block w-full px-5 py-4 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-gray-50/50 transition-all sm:text-sm font-medium"
                            placeholder="Пароль"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-lg border border-red-100 italic">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary uppercase tracking-widest transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg shadow-primary/20'}`}
                        >
                            {isLoading ? 'Вхід...' : 'Увійти'}
                        </button>
                    </div>
                </form>
            </Container>
        </div>
    );
}
