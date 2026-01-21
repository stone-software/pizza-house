'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { useCart } from '@/hooks/useCart';
import { ArrowLeft, CheckCircle2, Loader2, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createOrderAction } from '@/actions/order';

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart, isInitialized } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && cart.length === 0 && !isSuccess) {
            router.push('/cart');
        }
    }, [isInitialized, cart.length, isSuccess, router]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        deliveryTime: '',
        paymentMethod: 'cash',
        change: '',
        comment: ''
    });

    if (!isInitialized) return null;
    if (cart.length === 0 && !isSuccess) {
        router.push('/cart');
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await createOrderAction(formData, cart);

        if (result.success) {
            setOrderId(result.orderId || null);
            setIsSuccess(true);
            clearCart();
        } else {
            alert(result.error || 'Щось пішло не так. Спробуйте ще раз.');
        }
        setIsSubmitting(false);
    };

    if (isSuccess) {
        return (
            <Layout>
                <Container className="py-40 text-center">
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={64} />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4 uppercase italic">ДЯКУЄМО ЗА ЗАМОВЛЕННЯ!</h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto font-medium">
                        Ваше замовлення <span className="text-primary font-black">№{orderId}</span> прийнято в роботу.
                        Наш менеджер зв’яжеться з вами найближчим часом.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-gray-900 text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl"
                    >
                        ПОВЕРНУТИСЬ НА ГОЛОВНУ
                    </Link>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-gray-50 py-16 mb-12">
                <Container>
                    <span className="text-primary font-black uppercase tracking-[0.2em] text-sm mb-4 block text-center">Майже готово</span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 text-center uppercase italic leading-none tracking-tighter">ОФОРМЛЕННЯ ЗАМОВЛЕННЯ</h1>
                </Container>
            </div>

            <Container className="pb-24">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-12 mb-8">
                        <Link href="/cart" className="flex items-center gap-2 font-bold text-gray-400 hover:text-primary transition-colors inline-flex">
                            <ArrowLeft size={20} />
                            Назад до кошика
                        </Link>
                    </div>

                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <h2 className="text-2xl font-black uppercase italic mb-8 border-b border-gray-100 pb-4">Контактні дані</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase text-gray-400 ml-1">Ім’я</label>
                                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-5 outline-none font-bold transition-all" placeholder="Ваше ім’я" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase text-gray-400 ml-1">Прізвище</label>
                                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-5 outline-none font-bold transition-all" placeholder="Ваше прізвище" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase text-gray-400 ml-1">Номер телефону</label>
                                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-5 outline-none font-bold transition-all" placeholder="+380..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase text-gray-400 ml-1">Email</label>
                                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-5 outline-none font-bold transition-all" placeholder="email@example.com" />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black uppercase italic mb-8 border-b border-gray-100 pb-4">Доставка</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase text-gray-400 ml-1">Адреса доставки</label>
                                    <input required name="address" value={formData.address} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-5 outline-none font-bold transition-all" placeholder="Вулиця, будинок, квартира..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase text-gray-400 ml-1">Бажаний час доставки</label>
                                    <input required name="deliveryTime" value={formData.deliveryTime} onChange={handleInputChange} type="time" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-5 outline-none font-bold transition-all" />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black uppercase italic mb-8 border-b border-gray-100 pb-4">Оплата та коментар</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase text-gray-400 ml-1">Спосіб оплати</label>
                                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-5 outline-none font-bold transition-all appearance-none">
                                        <option value="cash">Готівка</option>
                                        <option value="terminal">Термінал (при отриманні)</option>
                                    </select>
                                </div>

                                {formData.paymentMethod === 'cash' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase text-gray-400 ml-1">Решта з</label>
                                        <input name="change" value={formData.change} onChange={handleInputChange} type="number" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-5 outline-none font-bold transition-all" placeholder="1000" />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase text-gray-400 ml-1">Коментар до замовлення</label>
                                    <textarea name="comment" value={formData.comment} onChange={handleInputChange} rows={3} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-5 outline-none font-bold transition-all" placeholder="Наприклад: Код під'їзду 123..."></textarea>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                            <h2 className="text-2xl font-black uppercase italic mb-8">Ваше замовлення</h2>
                            <div className="space-y-6 mb-10 overflow-auto max-h-[400px] pr-2">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                                            <p className="text-gray-400 text-xs font-bold">{item.quantity} x {(item.discount_price || item.price)} грн</p>
                                        </div>
                                        <div className="font-black text-gray-900 text-right">
                                            {(item.discount_price || item.price) * item.quantity} грн
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-200 mb-10">
                                <div className="flex justify-between font-bold text-gray-400 uppercase text-sm">
                                    <span>Підсумок</span>
                                    <span className="text-gray-900">{totalPrice} грн</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-400 uppercase text-sm">
                                    <span>Доставка</span>
                                    <span className="text-primary">Безкоштовно</span>
                                </div>
                                <div className="flex justify-between items-end pt-2">
                                    <span className="text-lg font-black uppercase italic text-gray-900">Загалом</span>
                                    <span className="text-4xl font-black text-primary leading-none">{totalPrice} грн</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-20 bg-primary text-white rounded-2xl font-black text-2xl flex items-center justify-center gap-4 hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={28} />
                                        <span>ОБРОБЛЯЄМО...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        <span>ЗАМОВИТИ</span>
                                    </>
                                )}
                            </button>

                            <p className="text-center text-gray-400 text-xs mt-6 font-bold uppercase tracking-widest">Оплата при отриманні</p>
                        </div>
                    </div>
                </form>
            </Container>
        </Layout>
    );
}
