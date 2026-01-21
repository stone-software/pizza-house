export type Category = 'pizza' | 'rolls' | 'sets' | 'drinks';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discount_price?: number;
    image: string;
    category_id: string;
    is_popular?: boolean;
    is_action?: boolean;
    weight?: string;
    categories?: { name: string };
}

export const CATEGORIES = [
    { id: 'pizza', name: 'Піца' },
    { id: 'rolls', name: 'Роли' },
    { id: 'sets', name: 'Сети' },
    { id: 'drinks', name: 'Напої' },
] as const;

export const PRODUCTS: Product[] = [
    // Pizza
    {
        id: 'p1',
        name: 'Гавайська',
        description: 'Ананаси, шинка, моцарела, томатний соус',
        price: 320,
        image: '/images/pizza_hawaii.png',
        category_id: 'pizza',
        is_popular: true,
        weight: '550г'
    },
    {
        id: 'p2',
        name: 'Супер м’ясо',
        description: 'Шинка, пепероні, бекон, моцарела, томатний соус',
        price: 380,
        discount_price: 340,
        image: '/images/pizza_meat.png',
        category_id: 'pizza',
        is_popular: true,
        is_action: true,
        weight: '600г'
    },
    {
        id: 'p3',
        name: '5 сирів',
        description: 'Моцарела, пармезан, дор блю, чеддер, маасдам',
        price: 350,
        image: '/images/pizza_5_cheese.png',
        category_id: 'pizza',
        is_popular: true,
        weight: '500г'
    },
    {
        id: 'p4',
        name: 'Маргарита',
        description: 'Томати, моцарела, базилік, томатний соус',
        price: 280,
        image: '/images/pizza_margarita.png',
        category_id: 'pizza',
        weight: '450г'
    },
    {
        id: 'p5',
        name: 'Вегетаріанська',
        description: 'Печериці, болгарський перць, томати, моцарела',
        price: 300,
        image: '/images/pizza_hawaii.png', // Fallback
        category_id: 'pizza',
        weight: '500г'
    },
    // Rolls
    {
        id: 'r1',
        name: 'Філадельфія класік',
        description: 'Лосось, крем-сир, огірок',
        price: 260,
        image: '/images/roll_philadelphia_classic.png',
        category_id: 'rolls',
        is_popular: true,
        weight: '280г'
    },
    {
        id: 'r2',
        name: 'Філадельфія з соусом унагі',
        description: 'Лосось, крем-сир, унагі соус, кунжут',
        price: 280,
        image: '/images/roll_unagi.png',
        category_id: 'rolls',
        is_popular: true,
        weight: '290г'
    },
    {
        id: 'r3',
        name: 'Філадельфія супер',
        description: 'Багато лосося, крем-сир, авокадо',
        price: 350,
        image: '/images/roll_philadelphia_classic.png', // Fallback
        category_id: 'rolls',
        weight: '320г'
    },
    {
        id: 'r4',
        name: 'Запечений рол',
        description: 'Мідії, спайсі соус, сирний заміс',
        price: 240,
        image: '/images/roll_baked_sushi.png',
        category_id: 'rolls',
        weight: '260г'
    },
    // Sets
    {
        id: 's1',
        name: 'Сімейний',
        description: 'Великий сет для всієї родини, 40 штук',
        price: 1200,
        discount_price: 999,
        image: '/images/roll_philadelphia_classic.png', // Fallback
        category_id: 'sets',
        is_popular: true,
        is_action: true,
        weight: '1200г'
    },
    // Drinks
    {
        id: 'd1',
        name: 'Coca-Cola',
        description: 'Газований напій, 0.5л',
        price: 45,
        image: '/images/hero_carousel_1.png', // Fallback
        category_id: 'drinks',
        is_popular: true,
        weight: '500мл'
    },
];
