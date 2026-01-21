'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza } from 'lucide-react';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Minimum loading time to show the animation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.6, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="relative">
                        {/* P Letter Logo */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: 1
                            }}
                            transition={{
                                scale: {
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: "easeInOut"
                                },
                                opacity: { duration: 0.5 }
                            }}
                            className="w-32 h-32 bg-primary flex items-center justify-center rounded-[2rem] shadow-2xl shadow-primary/20"
                        >
                            <span className="text-6xl font-black text-white italic tracking-tighter">P</span>
                        </motion.div>

                        {/* Rotating Pizza Icon */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                repeat: Infinity,
                                duration: 8,
                                ease: "linear"
                            }}
                            className="absolute -top-6 -right-6 bg-white p-3 rounded-full shadow-lg border border-gray-100"
                        >
                            <Pizza className="text-primary" size={32} />
                        </motion.div>
                    </div>

                    {/* Brand Name */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-10 text-center"
                    >
                        <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                            Pizza<span className="text-primary">House</span>
                        </h2>
                        <div className="mt-4 flex gap-1 justify-center">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1,
                                        delay: i * 0.2
                                    }}
                                    className="w-2 h-2 bg-primary rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Background decorative circles */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1.5 }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    delay: i * 0.5,
                                    ease: "easeOut"
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary rounded-full"
                                style={{ width: i * 200, height: i * 200 }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
