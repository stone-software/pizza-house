import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Container } from '../ui/Container';
import Link from 'next/link';

export function Layout({ children, fullWidth = false }: { children: ReactNode; fullWidth?: boolean }) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">
                {fullWidth ? children : <Container>{children}</Container>}
            </main>
            <footer className="bg-gray-900 text-white py-12 mt-20">
                <Container>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white rotate-12">
                                <span className="font-black italic -rotate-12">P</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase">PizzaHouse</span>
                        </div>
                        <div className="flex gap-6 text-sm font-bold text-gray-400">
                            <Link href="/about" className="hover:text-primary transition-colors">Про нас</Link>
                            <Link href="/delivery" className="hover:text-primary transition-colors">Доставка та оплата</Link>
                        </div>
                        <p className="text-gray-400 text-xs font-medium">© 2026 PizzaHouse Delivery. Усі права захищені.</p>
                    </div>
                </Container>
            </footer>
        </div>
    );
}
