import Image from 'next/image';
import { Heart, ShoppingBag, Weight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/features/ProductCard';
import { notFound } from 'next/navigation';
import { getProductById, getProductsByCategory } from '@/lib/data';
import { AddToCartButton } from '@/components/features/AddToCartButton';
import { WishlistToggleButton } from '@/components/features/WishlistToggleButton';
import { BackButton } from '@/components/ui/BackButton';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const productId = resolvedParams.id;
    const product = await getProductById(productId);

    if (!product) {
        notFound();
    }

    const similarProducts = await getProductsByCategory(product.category_id);
    const filteredSimilar = similarProducts.filter(p => p.id !== product.id).slice(0, 4);

    return (
        <Layout>
            <Container className="py-12">
                <BackButton />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-24">
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        {product.is_action && (
                            <div className="absolute top-8 left-8 bg-primary text-white text-sm font-black px-5 py-2 rounded-full shadow-2xl z-10">
                                АКЦІЯ
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-center">
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-none italic uppercase tracking-tighter">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-8">
                            {product.discount_price ? (
                                <>
                                    <span className="text-4xl md:text-5xl font-black text-primary leading-none">
                                        {product.discount_price} грн
                                    </span>
                                    <span className="text-2xl font-bold text-gray-300 line-through">
                                        {product.price} грн
                                    </span>
                                </>
                            ) : (
                                <span className="text-4xl md:text-5xl font-black text-gray-900 leading-none">
                                    {product.price} грн
                                </span>
                            )}
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-center gap-2 text-gray-500 font-bold bg-gray-50 self-start px-4 py-2 rounded-xl">
                                <Weight size={20} className="text-primary" />
                                <span>{product.weight || '300г'}</span>
                            </div>

                            <div className="prose prose-lg">
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {product.description}. Приготовано з любов’ю з найсвіжіших інгредієнтів. Спробуйте справжній смак нашої кухні вже сьогодні!
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <AddToCartButton product={product} />
                            <WishlistToggleButton product={product} />
                        </div>
                    </div>
                </div>

                {filteredSimilar.length > 0 && (
                    <section className="border-t border-gray-100 pt-20">
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-4xl font-black text-gray-900 uppercase italic leading-none">Схожі товари</h2>
                            <div className="h-0.5 flex-grow bg-gray-100" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredSimilar.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </Container>
        </Layout>
    );
}
