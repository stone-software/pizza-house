'use client';

import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/features/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
    const { wishlist, isInitialized } = useWishlist();

    if (!isInitialized) return null;

    return (
        <Layout>
            <div className="bg-gray-50 py-16 mb-12">
                <Container>
                    <span className="text-primary font-black uppercase tracking-[0.2em] text-sm mb-4 block text-center">Ви це любите</span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 text-center uppercase italic leading-none tracking-tighter">СПИСОК ПОБАЖАНЬ</h1>
                </Container>
            </div>

            <Container className="pb-20">
                {wishlist.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                            {wishlist.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-black mb-6 italic uppercase tracking-tighter">
                                    ГОТОВІ ДО ЗАМОВЛЕННЯ?
                                </h2>
                                <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto font-medium">
                                    У списку {wishlist.length} товарів на суму {wishlist.reduce((sum, p) => sum + (p.discountPrice || p.price), 0)} грн
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-4 bg-primary text-white px-12 py-6 rounded-2xl font-black text-2xl hover:bg-primary-dark hover:scale-105 transition-all shadow-2xl shadow-primary/20"
                                >
                                    КУПИТИ ВСЕ
                                    <ArrowRight size={28} />
                                </Link>
                            </div>

                            {/* Background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px]" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[100px]" />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-40">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                            <ShoppingBag size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase italic">СПИСОК ПОРОЖНІЙ</h2>
                        <p className="text-gray-500 mb-10 text-lg font-medium">Додайте товари, які вам сподобались, щоб не загубити їх.</p>
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
