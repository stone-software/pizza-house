import { HeroCarousel } from '@/components/features/HeroCarousel';
import { ProductCard } from '@/components/features/ProductCard';
import { Container } from '@/components/ui/Container';
import { Layout } from '@/components/layout/Layout';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/data';

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  return (
    <Layout>
      <HeroCarousel />

      <div className="py-20 space-y-20">
        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.category_id === category.id && p.is_popular);

          if (categoryProducts.length === 0) return null;

          return (
            <section key={category.id}>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-primary font-black uppercase tracking-[0.2em] text-sm mb-2 block">Популярні</span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic leading-none">{category.name}</h2>
                </div>
                <Link
                  href={`/category/${category.id}`}
                  className="flex items-center gap-2 font-bold text-gray-500 hover:text-primary transition-all group"
                >
                  Всі товари
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Layout>
  );
}
