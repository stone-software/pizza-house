'use client';

import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, isInitialized } = useCart();

    if (!isInitialized) return null;

    return (
        <Layout fullWidth>
            <div className="bg-gray-50 py-16 mb-12">
                <Container>
                    <span className="text-primary font-black uppercase tracking-[0.2em] text-sm mb-4 block text-center">Ваш вибір</span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 text-center uppercase italic leading-none tracking-tighter">КОШИК</h1>
                </Container>
            </div>

            <Container className="pb-24">
                {cart.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-8 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative"
                                    >
                                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-1">{item.name}</h3>
                                            <p className="text-gray-400 text-sm font-bold">{item.weight || '300г'}</p>
                                        </div>

                                        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-900 hover:text-primary transition-colors disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="w-8 text-center font-black text-xl">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-900 hover:text-primary transition-colors"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>

                                        <div className="text-2xl font-black text-gray-900 min-w-[120px] text-center">
                                            {(item.discount_price || item.price) * item.quantity} грн
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="lg:col-span-4 sticky top-32">
                            <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black mb-10 italic uppercase tracking-tighter border-b border-white/10 pb-6">ПІДСУМОК</h2>

                                    <div className="space-y-4 mb-10">
                                        <div className="flex justify-between text-gray-400 font-bold uppercase text-sm">
                                            <span>Товари ({totalItems})</span>
                                            <span className="text-white">{totalPrice} грн</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400 font-bold uppercase text-sm">
                                            <span>Доставка</span>
                                            <span className="text-primary">Безкоштовно</span>
                                        </div>
                                        <div className="h-px bg-white/10 pt-4" />
                                        <div className="flex justify-between items-end">
                                            <span className="text-lg font-black uppercase italic">Загалом</span>
                                            <span className="text-4xl font-black text-primary leading-none">{totalPrice} грн</span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="w-full bg-primary text-white h-20 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                                    >
                                        ОФОРМИТИ
                                        <ArrowRight size={24} />
                                    </Link>

                                    <Link
                                        href="/"
                                        className="w-full flex items-center justify-center gap-2 mt-6 text-gray-400 font-bold hover:text-white transition-colors"
                                    >
                                        <ChevronLeft size={18} />
                                        Продовжити покупки
                                    </Link>
                                </div>

                                {/* Visual elements */}
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-40">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                            <ShoppingBag size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase italic">КОШИК ПОРОЖНІЙ</h2>
                        <p className="text-gray-500 mb-10 text-lg font-medium">Ви ще нічого не додали до свого кошика.</p>
                        <Link
                            href="/"
                            className="inline-block bg-primary text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-primary-dark transition-all"
                        >
                            ПЕРЕЙТИ В МЕНЮ
                        </Link>
                    </div>
                )}
            </Container>
        </Layout>
    );
}
