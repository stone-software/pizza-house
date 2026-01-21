'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Package, FolderTree, ShoppingBag, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ products: 0, categories: 0, ordersToday: 0, profitMonth: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const monthStart = new Date();
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);

            const [pCount, cCount, oToday, oMonth, lastOrders] = await Promise.all([
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('categories').select('*', { count: 'exact', head: true }),
                supabase.from('orders').select('*', { count: 'exact', head: true })
                    .gte('created_at', today.toISOString())
                    .neq('status', 'cancelled'),
                supabase.from('orders')
                    .select('total_price')
                    .gte('created_at', monthStart.toISOString())
                    .eq('status', 'completed'),
                supabase.from('orders')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5)
            ]);

            const monthlyProfit = oMonth.data?.reduce((sum, order) => sum + Number(order.total_price), 0) || 0;

            setStats({
                products: pCount.count || 0,
                categories: cCount.count || 0,
                ordersToday: oToday.count || 0,
                profitMonth: monthlyProfit
            });
            setRecentOrders(lastOrders.data || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    const cards = [
        { name: 'Усього товарів', value: stats.products, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
        { name: 'Категорій', value: stats.categories, icon: FolderTree, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Замовлень (сьогодні)', value: stats.ordersToday, icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Прибуток (місяць)', value: `${stats.profitMonth} грн`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <AdminLayout>
            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-2">
                    Дашборд
                </h1>
                <p className="text-gray-500 font-medium tracking-wide">Загальна статистика вашого магазину PizzaHouse</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-6`}>
                                <Icon size={28} />
                            </div>
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">{card.name}</h3>
                            <p className="text-3xl font-black text-gray-900 italic tracking-tighter">
                                {loading ? '...' : card.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Останні дії</h2>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Останні 5 замовлень</span>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-gray-400 font-medium italic">Завантаження...</div>
                    ) : recentOrders.length === 0 ? (
                        <div className="text-gray-400 font-medium italic">Поки що немає активності.</div>
                    ) : (
                        recentOrders.map((order, i) => (
                            <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 group-hover:border-primary/20 transition-colors">
                                        <ShoppingBag size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 leading-tight">
                                            Нове замовлення <span className="text-primary italic">№{order.id}</span>
                                        </p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                            Від {order.customer_name} • {new Date(order.created_at).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${order.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                'bg-blue-100 text-blue-700 border-blue-200'
                                        }`}>
                                        {order.status === 'completed' ? 'Завершено' : order.status === 'cancelled' ? 'Скасовано' : 'Нове'}
                                    </span>
                                    <div className="text-sm font-black text-gray-900 italic">
                                        {order.total_price} ₴
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
