'use client';

import { Button } from './Button';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
        >
            <div className="rounded-full bg-slate-100 p-6 mb-4">
                <Icon size={48} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 text-center mb-6 max-w-md">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </motion.div>
    );
}
