'use client';

import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <motion.div
                className="flex space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    className="h-4 w-4 rounded-full bg-blue-600"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="h-4 w-4 rounded-full bg-blue-500"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.1, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="h-4 w-4 rounded-full bg-blue-400"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.2, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>
        </div>
    );
}
