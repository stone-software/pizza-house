'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Clock, CheckCircle2, XCircle, Package, User, Phone, MapPin, CreditCard } from 'lucide-react';
import { updateOrderStatusAction } from '@/actions/order-mgmt';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchOrders() {
        setLoading(true);
        const { data } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        setOrders(data || []);
        setLoading(false);
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        const result = await updateOrderStatusAction(id, newStatus);
        if (result.success) {
            fetchOrders();
        } else {
            alert('Помилка оновлення статусу');
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Завершено';
            case 'cancelled': return 'Скасовано';
            default: return 'Нове';
        }
    };

    return (
        <AdminLayout>
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-2">
                        Замовлення
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide">Керування статусами та історія продажів</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                    <Clock size={20} />
                    Оновити дані
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center font-bold text-gray-400 italic">Завантаження замовлень...</div>
            ) : (
                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 font-medium italic">
                            Замовлень поки що немає
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* Order Info */}
                                    <div className="lg:col-span-3">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-2xl font-black italic text-gray-900">№{order.id}</span>
                                            <span className={twMerge('px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border', getStatusStyles(order.status))}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <div className="text-sm font-bold text-gray-400 mb-6">
                                            {new Date(order.created_at).toLocaleString('uk-UA')}
                                        </div>
                                        <div className="text-3xl font-black text-primary italic leading-none">
                                            {order.total_price} грн
                                        </div>
                                    </div>

                                    {/* Customer & Delivery */}
                                    <div className="lg:col-span-4 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <User size={18} className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="font-bold text-gray-900 leading-tight">{order.customer_name}</p>
                                                <p className="text-sm text-gray-500 font-medium">{order.customer_phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin size={18} className="text-gray-400 mt-1" />
                                            <p className="font-medium text-gray-600 text-sm">{order.address}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CreditCard size={18} className="text-gray-400" />
                                            <p className="text-sm font-bold uppercase text-gray-400 italic">
                                                {order.payment_method === 'cash' ? 'Готівка' : 'Термінал'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="lg:col-span-3">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Склад замовлення:</h4>
                                        <ul className="space-y-2">
                                            {order.items.map((item: any, idx: number) => (
                                                <li key={idx} className="text-sm font-bold text-gray-700 flex justify-between">
                                                    <span>{item.name} x{item.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Actions */}
                                    <div className="lg:col-span-2 flex flex-col gap-2 justify-center">
                                        {order.status === 'new' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <CheckCircle2 size={18} />
                                                    Виконано
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                                    className="w-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 p-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <XCircle size={18} />
                                                    Скасувати
                                                </button>
                                            </>
                                        )}
                                        {order.status !== 'new' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'new')}
                                                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-400 p-3 rounded-xl font-bold transition-all text-xs"
                                            >
                                                Повернути в "Нові"
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
