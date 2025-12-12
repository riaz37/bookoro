'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Calendar, XCircle, CheckCircle2, Plane } from 'lucide-react';
import { Booking } from '@/types/booking';
import { motion } from 'framer-motion';

interface BookingCardProps {
    booking: Booking;
    index: number;
    onCancel: (bookingId: string) => void;
}

export function BookingCard({ booking, index, onCancel }: BookingCardProps) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const handleCancel = async () => {
        setCancelling(true);
        try {
            await onCancel(booking.id);
            setShowCancelModal(false);
        } finally {
            setCancelling(false);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
            >
                <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
                    {/* Status Bar */}
                    <div className={`h-1.5 ${booking.status === 'CONFIRMED' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`} />

                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Left: Booking Info */}
                            <div className="flex-1 space-y-3">
                                {/* Booking ID & Date */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                            <Plane size={16} className="text-blue-600" />
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            #{booking.id.substring(0, 8).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${booking.status === 'CONFIRMED'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        {booking.status === 'CONFIRMED' ? (
                                            <CheckCircle2 size={12} />
                                        ) : (
                                            <XCircle size={12} />
                                        )}
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Flight Info */}
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        Booked {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="font-medium text-slate-600">
                                        Flight {booking.flightId.substring(0, 8).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            {booking.status === 'CONFIRMED' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowCancelModal(true)}
                                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors whitespace-nowrap shrink-0"
                                >
                                    <XCircle size={16} />
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Cancel Confirmation Modal */}
            <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancel}
                title="Cancel Booking?"
                description={`Are you sure you want to cancel booking #${booking.id.substring(0, 8).toUpperCase()}? This action cannot be undone.`}
                confirmText="Yes, Cancel"
                cancelText="Keep It"
                variant="danger"
                loading={cancelling}
            />
        </>
    );
}
