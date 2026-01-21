'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Menu, Search, Heart, ShoppingBag, Phone, Clock, X, ChevronRight,
    Pizza, CupSoda, Leaf, CakeSlice, Fish, Utensils, UtensilsCrossed
} from 'lucide-react';
import { Container } from '../ui/Container';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const ICON_MAP: Record<string, any> = {
    pizza: Pizza,
    sushi: Fish,
    rolls: Fish,
    drinks: CupSoda,
    salads: Leaf,
    desserts: CakeSlice,
    default: Utensils
};

function CategoryIcon({ name, className }: { name: string; className?: string }) {
    const Icon = ICON_MAP[name.toLowerCase()] || ICON_MAP.default;
    return <Icon className={className} size={18} />;
}

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const { totalItems } = useCart();
    const { wishlist } = useWishlist();

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
            setCategories(data || []);
        }
        fetchCategories();
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            {/* Top Bar */}
            <div className="bg-gray-50 py-2 hidden md:block">
                <Container className="flex justify-between items-center text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-primary" />
                            <span>+380 (93) 123 45 67</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-primary" />
                            <span>10:00 - 22:00 (Щодня)</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/about" className="hover:text-primary transition-colors">Про нас</Link>
                        <Link href="/delivery" className="hover:text-primary transition-colors">Доставка та оплата</Link>
                    </div>
                </Container>
            </div>

            {/* Main Nav */}
            <nav className="py-4 bg-white">
                <Container className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-8">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:text-primary"
                        >
                            <Menu size={28} />
                        </button>

                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white rotate-12 group hover:rotate-0 transition-transform duration-300">
                                <span className="text-2xl font-black italic -rotate-12 group-hover:rotate-0 transition-transform">P</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gray-900 hidden sm:block">PIZZA<span className="text-primary">HOUSE</span></span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-2 relative">
                            <button
                                onMouseEnter={() => setIsCategoryOpen(true)}
                                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary transition-colors"
                            >
                                <Menu size={20} />
                                <span>КАТЕГОРІЇ</span>
                            </button>

                            <AnimatePresence>
                                {isCategoryOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        onMouseLeave={() => setIsCategoryOpen(false)}
                                        className="absolute top-full left-0 mt-2 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 min-w-[200px]"
                                    >
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/category/${cat.id}`}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 font-bold text-gray-700 hover:text-primary transition-colors group/item"
                                                onClick={() => setIsCategoryOpen(false)}
                                            >
                                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover/item:text-primary group-hover/item:bg-primary/10 transition-colors">
                                                    <CategoryIcon name={cat.icon || cat.id} />
                                                </div>
                                                <span className="flex-grow">{cat.name}</span>
                                                <ChevronRight size={16} className="text-gray-300 group-hover/item:text-primary transition-colors" />
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex-grow max-w-xl hidden md:block">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const q = formData.get('q');
                                if (q) window.location.href = `/search?q=${encodeURIComponent(q.toString())}`;
                            }}
                            className="relative group"
                        >
                            <input
                                name="q"
                                type="text"
                                placeholder="Пошук смачненького..."
                                className="w-full bg-gray-100 border-transparent border focus:border-primary focus:bg-white px-5 py-2.5 rounded-xl outline-none transition-all pr-12 font-medium"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <Link
                            href="/wishlist"
                            className="p-2.5 text-gray-600 hover:text-primary relative group"
                        >
                            <Heart size={26} className="group-hover:scale-110 transition-transform" />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/cart"
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-all group"
                        >
                            <div className="relative">
                                <ShoppingBag size={24} className="text-gray-900 group-hover:text-primary transition-colors" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <span className="font-bold text-gray-900 hidden sm:block">КОШИК</span>
                        </Link>
                    </div>
                </Container>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="text-2xl font-black italic">MENU</span>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500">
                                    <X size={28} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold py-2 border-b border-gray-100 flex justify-between items-center">
                                    Головна
                                    <ChevronRight />
                                </Link>
                                <div className="py-4">
                                    <span className="text-xs font-black text-primary uppercase tracking-widest mb-4 block">Категорії</span>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/category/${cat.id}`}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="bg-gray-50 p-4 rounded-xl font-bold flex flex-col items-center gap-2 hover:bg-primary/10 transition-colors"
                                            >
                                                <div className="text-primary/40">
                                                    <CategoryIcon name={cat.icon || cat.id} />
                                                </div>
                                                <span className="text-sm">{cat.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold py-2 border-b border-gray-100 flex justify-between items-center text-gray-400">
                                    Про нас
                                    <ChevronRight />
                                </Link>
                                <Link href="/delivery" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold py-2 border-b border-gray-100 flex justify-between items-center text-gray-400">
                                    Доставка та оплата
                                    <ChevronRight />
                                </Link>
                            </div>

                            <div className="mt-auto grid grid-cols-1 gap-4 pt-10">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Phone size={20} className="text-primary" />
                                    <span className="font-bold">+380 (93) 123 45 67</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Clock size={20} className="text-primary" />
                                    <span className="font-bold">10:00 - 22:00</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
