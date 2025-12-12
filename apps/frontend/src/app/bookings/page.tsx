'use client';

import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { BookingCard } from '@/components/bookings/BookingCard';
import { BookingCardSkeleton } from '@/components/skeletons/BookingCardSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import Loading from '@/components/ui/Loading';

export default function BookingsPage() {
    const { bookings, isLoading: loading, cancelBooking } = useBookings();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <PageHeader />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h2>
                    <p className="text-slate-600">View and manage your flight reservations</p>
                </motion.div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <BookingCardSkeleton key={i} />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="No bookings yet"
                        description="Start exploring flights and book your next adventure!"
                        actionLabel="Browse Flights"
                        onAction={() => router.push('/flights')}
                    />
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking, index) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                index={index}
                                onCancel={cancelBooking}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
