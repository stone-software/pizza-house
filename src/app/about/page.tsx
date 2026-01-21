import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { Star, Trophy, Users, Heart } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
    const stats = [
        { icon: Star, label: 'Якість', text: 'Тільки свіжі та преміальні інгредієнти кожного дня.' },
        { icon: Trophy, label: 'Досвід', text: 'Понад 5 років ми готуємо найкращу піцу та роли.' },
        { icon: Users, label: 'Команда', text: 'Професійні шеф-кухарі та швидкі кур’єри.' },
        { icon: Heart, label: 'Любов', text: 'Готуємо з душею, як для своєї родини.' },
    ];

    return (
        <Layout fullWidth>
            {/* Hero Section */}
            <div className="bg-gray-50 py-24 mb-16 relative overflow-hidden">
                <Container className="relative z-10">
                    <span className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-6 block text-center">Наша історія</span>
                    <h1 className="text-6xl md:text-8xl font-black text-gray-900 text-center uppercase italic leading-none tracking-tighter mb-8">
                        БІЛЬШЕ НІЖ <span className="text-primary tracking-normal not-italic">ПРОСТО</span> ЇЖА
                    </h1>
                    <p className="text-xl text-gray-500 text-center max-w-2xl mx-auto font-medium leading-relaxed">
                        Ми розпочали з маленької мрії про ідеальну піцу, а сьогодні PizzaHouse — це місце, де створюються гастрономічні шедеври для вашого задоволення.
                    </p>
                </Container>

                {/* Decorative background element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-gray-100/50 pointer-events-none select-none italic tracking-tighter uppercase z-0">
                    PIZZAHOUSE
                </div>
            </div>

            <Container className="pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 bg-gray-100">
                        {/* Note: In a real app we'd use a real photo. Using generated placeholder logic here */}
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center p-20">
                            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-primary/20 text-9xl font-black italic">PH</div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-4xl font-black uppercase italic leading-tight text-gray-900">
                            ЧОМУ ОБИРАЮТЬ <br />
                            <span className="text-primary">НАС ТИСЯЧІ КЛІЄНТІВ?</span>
                        </h2>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            У PizzaHouse ми не йдемо на компроміси, коли мова йде про смак. Кожна піца розкачується вручну, а кожен рол згортається з особливою увагою до балансу інгредієнтів.
                        </p>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                    <span className="font-black">01</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Фермерські продукти</h4>
                                    <p className="text-sm text-gray-500 font-medium">Співпрацюємо тільки з надійними постачальниками свіжих овочів та м'яса.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                    <span className="font-black">02</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Рецептура від шефа</h4>
                                    <p className="text-sm text-gray-500 font-medium">Наші соуси та тісто готуються за унікальними авторськими рецептами.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                    <span className="font-black">03</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Швидка логістика</h4>
                                    <p className="text-sm text-gray-500 font-medium">Ваше замовлення прибуде гарячим завдяки спеціальним термосумкам та швидким кур'єрам.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 text-center group">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-xl font-black uppercase italic text-gray-900 mb-3">{stat.label}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{stat.text}</p>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </Layout>
    );
}
