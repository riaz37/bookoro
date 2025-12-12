'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false,
}: ConfirmModalProps) {
    const variants = {
        danger: {
            icon: 'bg-red-100 text-red-600',
            button: 'bg-red-600 hover:bg-red-700 text-white',
            iconBg: 'from-red-500/20 to-orange-500/20',
        },
        warning: {
            icon: 'bg-amber-100 text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700 text-white',
            iconBg: 'from-amber-500/20 to-yellow-500/20',
        },
        info: {
            icon: 'bg-blue-100 text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            iconBg: 'from-blue-500/20 to-indigo-500/20',
        },
    };

    const style = variants[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${style.iconBg} opacity-50`} />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="relative p-6 pt-8">
                                {/* Icon */}
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${style.icon}`}>
                                        <AlertTriangle size={24} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                        {description}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={onClose}
                                        disabled={loading}
                                    >
                                        {cancelText}
                                    </Button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={loading}
                                        className={`flex-1 rounded-lg px-4 py-2.5 font-semibold transition-all duration-200 ${style.button} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            confirmText
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
