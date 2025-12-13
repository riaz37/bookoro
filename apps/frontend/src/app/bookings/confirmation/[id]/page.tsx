'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { bookingsService } from '@/services/bookings.service';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function BookingConfirmationPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const flightId = params.id as string;
    const price = searchParams.get('price');
    const { user } = useAuth();
    const router = useRouter();
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);

    // Guard against direct access if not logged in (simplified)
    useEffect(() => {
        if (!user && !localStorage.getItem('access_token')) {
            router.push('/login');
        }
    }, [user, router]);

    const handleBooking = async () => {
        setLoading(true);
        try {
            await bookingsService.create(flightId);
            setConfirmed(true);
            toast.success('Flight booked successfully!');
        } catch (err) {
            toast.error('Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (confirmed) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Card className="w-full max-w-md border-green-100 bg-white shadow-xl">
                        <CardHeader className="text-center pb-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50"
                            >
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-slate-900">Order Confirmed!</h1>
                            <p className="text-slate-500">Thank you for flying with Bookoro.</p>
                        </CardHeader>
                        <CardContent className="text-center space-y-8 p-8">
                            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                                A confirmation email has been sent to <br />
                                <span className="font-semibold">{user?.email}</span>
                            </div>
                            <div className="space-y-3">
                                <Button onClick={() => router.push('/flights')} className="w-full" size="lg">
                                    Book Another Flight
                                </Button>
                                <Button onClick={() => router.push('/bookings')} className="w-full" variant="outline" size="lg">
                                    View My Bookings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            {loading && <Loading />}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-lg"
            >
                <div className="mb-4">
                    <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2 border-0 bg-transparent shadow-none hover:bg-slate-200">
                        <ArrowLeft size={16} /> Back
                    </Button>
                </div>
                <Card className="shadow-2xl">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
                        <h2 className="text-center text-xl font-semibold text-slate-900">Confirm Your Booking</h2>
                    </CardHeader>
                    <CardContent className="space-y-8 p-8">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Passenger</span>
                                <span className="font-medium text-slate-900">{user?.name || 'Guest'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Flight ID</span>
                                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-900">{flightId}</span>
                            </div>
                            <div className="border-t border-slate-100 pt-4 flex justify-between items-end">
                                <span className="text-slate-500">Total Price</span>
                                <span className="text-3xl font-bold text-blue-600">${price}</span>
                            </div>
                        </div>

                        <Button className="w-full text-lg" size="lg" onClick={handleBooking}>
                            Pay & Confirm
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
