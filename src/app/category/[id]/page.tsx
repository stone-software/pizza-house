import { ProductCard } from '@/components/features/ProductCard';
import { Container } from '@/components/ui/Container';
import { Layout } from '@/components/layout/Layout';
import { notFound } from 'next/navigation';
import { getCategories, getProductsByCategory } from '@/lib/data';

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const categoryId = resolvedParams.id;

    const [categories, categoryProducts] = await Promise.all([
        getCategories(),
        getProductsByCategory(categoryId)
    ]);

    const category = categories.find(c => c.id === categoryId);

    if (!category) {
        notFound();
    }

    return (
        <Layout fullWidth>
            <div className="bg-gray-50 py-16 mb-12">
                <Container>
                    <span className="text-primary font-black uppercase tracking-[0.2em] text-sm mb-4 block text-center">Категорія</span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 text-center uppercase italic leading-none">{category.name}</h1>
                </Container>
            </div>

            <Container className="pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {categoryProducts.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-400 font-bold text-xl">
                            Товарів ще немає в цій категорії
                        </div>
                    )}
                </div>
            </Container>
        </Layout>
    );
}
