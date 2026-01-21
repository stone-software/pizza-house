'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/constants/products';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { motion } from 'framer-motion';

export function ProductCard({ product }: { product: Product }) {
    const { addToCart, cart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const inCart = cart.some((item) => item.id === product.id);
    const featuredInWishlist = isInWishlist(product.id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
        >
            <div className="relative aspect-square overflow-hidden cursor-pointer">
                <Link href={`/product/${product.id}`}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </Link>

                {product.is_action && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                        АКЦІЯ
                    </div>
                )}

                <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-4 right-4 p-2 rounded-full shadow-md z-10 transition-colors ${featuredInWishlist ? 'bg-primary text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
                        }`}
                >
                    <Heart size={20} fill={featuredInWishlist ? 'currentColor' : 'none'} />
                </button>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <Link href={`/product/${product.id}`} className="block flex-grow">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>
                </Link>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        {product.discount_price ? (
                            <>
                                <span className="text-gray-400 text-sm line-through leading-none mb-1">{product.price} грн</span>
                                <span className="text-2xl font-black text-primary leading-none">{product.discount_price} грн</span>
                            </>
                        ) : (
                            <span className="text-2xl font-black text-gray-900 leading-none">{product.price} грн</span>
                        )}
                    </div>

                    <button
                        onClick={() => !inCart && addToCart(product)}
                        disabled={inCart}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${inCart
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg active:scale-95'
                            }`}
                    >
                        {inCart ? (
                            'В КОШИКУ'
                        ) : (
                            <>
                                <ShoppingBag size={20} />
                                <span>КУПИТИ</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
