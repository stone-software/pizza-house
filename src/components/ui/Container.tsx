import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn('mx-auto max-w-7xl px-4 md:px-6 w-full', className)}>
            {children}
        </div>
    );
}
