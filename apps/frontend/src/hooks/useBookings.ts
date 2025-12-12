import { useState, useEffect, useCallback } from 'react';
import { bookingsService, Booking } from '@/services/bookings.service';
import toast from 'react-hot-toast';

export { type Booking };

export function useBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await bookingsService.getUserBookings();
            setBookings(data);
        } catch (err) {
            toast.error('Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelBooking = async (bookingId: string) => {
        try {
            await bookingsService.cancelBooking(bookingId);
            toast.success('Booking cancelled successfully!');
            await fetchBookings(); // Refresh list
        } catch (err: any) {
            toast.error(err.message || 'Failed to cancel booking.');
            throw err;
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return { bookings, loading, refetch: fetchBookings, cancelBooking };
}
