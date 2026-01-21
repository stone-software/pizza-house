import { ProductCard } from '@/components/features/ProductCard';
import { Container } from '@/components/ui/Container';
import { Layout } from '@/components/layout/Layout';
import { Search as SearchIcon } from 'lucide-react';
import { getProducts } from '@/lib/data';

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams;
    const query = q?.toLowerCase() || '';

    // Fetch real products from Supabase
    const allProducts = await getProducts();

    const results = allProducts.filter((p: any) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.categories?.name && p.categories.name.toLowerCase().includes(query))
    );

    return (
        <Layout fullWidth>
            <div className="bg-gray-50 py-16 mb-12">
                <Container>
                    <span className="text-primary font-black uppercase tracking-[0.2em] text-sm mb-4 block text-center">Результати пошуку</span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 text-center uppercase italic leading-none tracking-tighter">
                        &ldquo;{query}&rdquo;
                    </h1>
                </Container>
            </div>

            <Container className="pb-20">
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {results.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <SearchIcon size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase italic">НІЧОГО НЕ ЗНАЙДЕНО</h2>
                        <p className="text-gray-500 font-medium">Спробуйте змінити запит або переглянути наше меню.</p>
                    </div>
                )}
            </Container>
        </Layout>
    );
}
