'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, FolderTree, Package, LogOut, Home, ShoppingBag, ShieldAlert } from 'lucide-react';
import { logoutAdminAction } from '@/actions/auth';
import { supabase } from '@/lib/supabase';
import { Container } from '../ui/Container';

const MENU_ITEMS = [
    { name: 'Дашборд', icon: LayoutGrid, href: '/admin/dashboard' },
    { name: 'Замовлення', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Категорії', icon: FolderTree, href: '/admin/categories' },
    { name: 'Товари', icon: Package, href: '/admin/products' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/admin/login');
            } else {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.replace('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary animate-pulse">
                        <ShieldAlert size={32} />
                    </div>
                    <p className="text-gray-400 font-bold italic animate-pulse">Перевірка доступу...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col">
                <div className="mb-10">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white rotate-12 group-hover:rotate-0 transition-transform">
                            <span className="font-black italic -rotate-12 group-hover:rotate-0 transition-transform">P</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">Pizza<span className="text-primary">House</span></span>
                    </Link>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Admin Management</p>
                </div>

                <nav className="flex-grow space-y-2">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-10 pt-6 border-t border-white/10 space-y-2">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-bold text-sm transition-all">
                        <Home size={18} />
                        На сайт
                    </Link>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.replace('/admin/login');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 font-bold text-sm transition-all"
                    >
                        <LogOut size={18} />
                        Вийти
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-10 overflow-x-hidden">
                <Container className="max-w-6xl mx-0 px-0">
                    {children}
                </Container>
            </main>
        </div>
    );
}
