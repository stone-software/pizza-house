'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type = 'success', isVisible, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: <Check size={20} className="text-white" />,
        error: <X size={20} className="text-white" />,
        warning: <AlertTriangle size={20} className="text-white" />,
        info: <Info size={20} className="text-white" />
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md bg-white border border-gray-100 min-w-[300px]"
                >
                    <div className={`p-2 rounded-full ${bgColors[type]} shadow-lg`}>
                        {icons[type]}
                    </div>
                    <div className="flex-grow">
                        <p className={`text-sm font-black uppercase tracking-wide ${type === 'error' ? 'text-red-600' : 'text-gray-800'}`}>
                            {type === 'error' ? 'Помилка' : type === 'success' ? 'Успішно' : type === 'warning' ? 'Увага' : 'Інфо'}
                        </p>
                        <p className="text-sm font-medium text-gray-500 leading-tight mt-0.5">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
