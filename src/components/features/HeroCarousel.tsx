'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../ui/Container';

const SLIDES = [
    {
        image: '/images/hero_carousel_1.png',
        title: 'НАЙКРАЩА ПІЦА ТА СУШІ У МІСТІ',
        description: 'Отримуй задоволення від кожного шматочка. Швидка доставка до твого порогу.',
        cta: 'ЗАМОВИТИ ЗАРАЗ',
        link: '/category/pizza'
    },
    {
        image: '/images/pizza_meat.png',
        title: 'Спробуй нашу нову М’ясну піцу',
        description: 'Більше м’яса, більше смаку, більше задоволення.',
        cta: 'ХОЧУ ПІЦУ',
        link: '/category/pizza'
    },
    {
        image: '/images/roll_philadelphia_classic.png',
        title: 'Класика, яка не набридає',
        description: 'Філадельфія з найсвіжішим лососем та ніжним крем-сиром.',
        cta: 'ОБРАТИ СУШІ',
        link: '/category/rolls'
    }
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isHoveredRef = useRef(false);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (isHoveredRef.current) return;
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
        }, 6000);
    }, []);

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [startTimer]);

    const next = () => {
        setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
        startTimer();
    };

    const prev = () => {
        setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
        startTimer();
    };

    const goTo = (index: number) => {
        setCurrent(index);
        startTimer();
    };

    const handleMouseEnter = () => {
        isHoveredRef.current = true;
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleMouseLeave = () => {
        isHoveredRef.current = false;
        startTimer();
    };

    return (
        <section
            className="relative h-[550px] md:h-[650px] overflow-hidden group rounded-[2.5rem] mt-8"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={SLIDES[current].image}
                        alt={SLIDES[current].title}
                        fill
                        className="object-cover scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="relative h-full flex flex-col justify-center px-8 md:px-28">
                <div className="max-w-2xl mt-[-40px] md:mt-0 text-center md:text-left">
                    <motion.h1
                        key={`title-${current}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-4xl md:text-7xl font-black text-white mb-4 md:mb-6 uppercase leading-[1.1] tracking-tight italic"
                    >
                        {SLIDES[current].title}
                    </motion.h1>
                    <motion.p
                        key={`desc-${current}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-lg md:text-2xl text-white/70 mb-8 md:mb-12 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium"
                    >
                        {SLIDES[current].description}
                    </motion.p>
                    <motion.div
                        key={`cta-${current}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <Link
                            href={SLIDES[current].link}
                            className="inline-block bg-primary text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black text-lg md:text-2xl hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 uppercase tracking-widest"
                        >
                            {SLIDES[current].cta}
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex absolute inset-y-0 left-4 items-center">
                <button
                    onClick={prev}
                    className="p-5 bg-black/20 backdrop-blur-xl rounded-full text-white hover:bg-primary hover:scale-110 active:scale-90 transition-all border border-white/10"
                >
                    <ChevronLeft size={32} />
                </button>
            </div>
            <div className="hidden md:flex absolute inset-y-0 right-4 items-center">
                <button
                    onClick={next}
                    className="p-5 bg-black/20 backdrop-blur-xl rounded-full text-white hover:bg-primary hover:scale-110 active:scale-90 transition-all border border-white/10"
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Bottom Controls Bar (Unified for Mobile/Desktop) */}
            <div className="absolute bottom-6 md:bottom-12 left-0 right-0">
                <div className="px-6 flex items-center justify-between md:justify-center gap-8">
                    {/* Mobile Prev Arrow */}
                    <button
                        onClick={prev}
                        className="md:hidden p-4 bg-black/40 backdrop-blur-lg rounded-full text-white active:scale-90 transition-transform border border-white/10"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Indicators */}
                    <div className="flex gap-2.5">
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`h-2 transition-all rounded-full ${i === current ? 'w-12 bg-primary shadow-lg shadow-primary/50' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                            />
                        ))}
                    </div>

                    {/* Mobile Next Arrow */}
                    <button
                        onClick={next}
                        className="md:hidden p-4 bg-black/40 backdrop-blur-lg rounded-full text-white active:scale-90 transition-transform border border-white/10"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
}
