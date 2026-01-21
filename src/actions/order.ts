'use server';

import { supabase } from '@/lib/supabase';

export async function createOrderAction(formData: any, cartItems: any[]) {
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
        console.error('Telegram credentials missing');
        return { success: false, error: 'Server configuration error' };
    }
    const total = cartItems.reduce((s: number, i: any) => {
        const price = i.discount_price || i.discountPrice || i.price;
        return s + price * i.quantity;
    }, 0);
    const itemsText = cartItems.map((i: any) => `${i.name} x${i.quantity}`).join('\n');

    // 1. Save to Database
    const { data: dbData, error: dbError } = await supabase.from('orders').insert([{
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_phone: formData.phone,
        address: formData.address,
        delivery_time: formData.deliveryTime,
        payment_method: formData.paymentMethod,
        total_price: total,
        items: cartItems,
        status: 'new'
    }]).select('id').single();

    if (dbError) {
        console.error('Database order save error:', dbError);
        return { success: false, error: 'Помилка бази даних: ' + dbError.message };
    }

    const orderId = dbData.id;

    const text = `🛒 <b>НОВЕ ЗАМОВЛЕННЯ №${orderId}</b>\n\n` +
        `<b>Імʼя:</b> ${formData.firstName} ${formData.lastName}\n` +
        `<b>Телефон:</b> ${formData.phone}\n` +
        `<b>Адреса:</b> ${formData.address}\n` +
        `<b>Час доставки:</b> ${formData.deliveryTime}\n\n` +
        `<b>Склад:</b>\n${itemsText}\n\n` +
        `<b>Сума:</b> ${total} грн\n` +
        `💰 <b>Разом: ${total} грн</b>\n` +
        `💳 <b>Оплата:</b> ${formData.paymentMethod === 'cash' ? 'Готівка' : 'Термінал'}${formData.change ? `, решта з ${formData.change} грн` : ''}\n\n` +
        `🔗 <a href="https://pizza-house-gamma.vercel.app/admin/orders">Керувати замовленням в адмін-панелі</a>`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: telegramChatId, text, parse_mode: 'HTML' })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram error:', errorData);
            return { success: false, error: 'Failed to notify administrator' };
        }

        return { success: true, orderId };
    } catch (e) {
        console.error('Telegram notification failed', e);
        return { success: false, error: 'Notification failed' };
    }
}
