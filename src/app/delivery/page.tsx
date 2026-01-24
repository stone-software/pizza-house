import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { Truck, Clock, CreditCard, Wallet, MapPin, ShieldCheck } from 'lucide-react';

export default function DeliveryPage() {
    return (
        <Layout fullWidth>
            <div className="bg-gray-50 py-24 mb-16 relative overflow-hidden">
                <Container className="relative z-10 text-center">
                    <span className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-6 block">Інформація</span>
                    <h1 className="text-6xl md:text-8xl font-black text-gray-900 uppercase italic leading-none tracking-tighter mb-8">
                        ДОСТАВКА <span className="text-primary tracking-normal not-italic">ТА</span> ОПЛАТА
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Ми робимо все, щоб ваше замовлення прибуло максимально швидко та було оплачене зручним для вас способом.
                    </p>
                </Container>
            </div>

            <Container className="pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Delivery Info */}
                    <div className="bg-white p-12 rounded-[3rem] border-2 border-primary/10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
                            <Truck size={200} />
                        </div>

                        <h2 className="text-3xl font-black uppercase italic text-gray-900 mb-10 flex items-center gap-4">
                            <div className="p-3 bg-primary text-white rounded-2xl"><Truck size={28} /></div>
                            ДОСТАВКА
                        </h2>

                        <div className="space-y-10">
                            <div className="flex gap-6">
                                <div className="p-4 bg-gray-50 rounded-2xl text-primary shrink-0"><Clock size={28} /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Час роботи</h4>
                                    <p className="text-gray-500 font-medium">Ми приймаємо замовлення щодня з <span className="text-gray-900 font-black italic">10:00 до 22:00</span>. Час доставки зазвичай складає 45-60 хвилин.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="p-4 bg-gray-50 rounded-2xl text-primary shrink-0"><MapPin size={28} /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Райони доставки</h4>
                                    <p className="text-gray-500 font-medium">Доставляємо по всьому місту та в найближчі передмістя. Вартість доставки розраховується автоматично.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="p-4 bg-gray-50 rounded-2xl text-primary shrink-0"><ShieldCheck size={28} /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Вартість</h4>
                                    <p className="text-gray-500 font-medium">Безкоштовна доставка при замовленні від <span className="text-primary font-black">500 грн</span>. Мінімальна сума замовлення — 250 грн.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gray-900 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                            <CreditCard size={200} />
                        </div>

                        <h2 className="text-3xl font-black uppercase italic mb-10 flex items-center gap-4">
                            <div className="p-3 bg-primary text-white rounded-2xl"><CreditCard size={28} /></div>
                            ОПЛАТА
                        </h2>

                        <div className="space-y-10">
                            <div className="flex gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="p-4 bg-primary rounded-2xl text-white shrink-0 shadow-lg shadow-primary/20 flex h-min justify-center items-center"><Wallet size={28} /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2">Готівкою кур'єру</h4>
                                    <p className="text-gray-400 font-medium">Ви можете оплатити замовлення готівкою при отриманні. Будь ласка, вкажіть у коментарі, якщо вам потрібна решта.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="p-4 bg-primary rounded-2xl text-white shrink-0 shadow-lg shadow-primary/20 flex h-min justify-center items-center"><CreditCard size={28} /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2">Готівкою кур'єру</h4>
                                    <p className="text-gray-400 font-medium">Всі наші кур'єри мають при собі мобільні термінали. Просто оберіть цей варіант при оформленні замовлення.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Section */}
                <div className="bg-primary/5 rounded-[3rem] p-12 text-center border border-primary/10">
                    <h3 className="text-2xl font-black uppercase italic text-gray-900 mb-4">Маєте запитання?</h3>
                    <p className="text-gray-500 font-medium mb-8">Наш оператор з радістю відповість на всі ваші запитання щодо доставки та оплати.</p>
                    <a href="tel:+380931234567" className="text-3xl font-black text-primary italic hover:tracking-widest transition-all">+380 (93) 123 45 67</a>
                </div>
            </Container>
        </Layout>
    );
}
