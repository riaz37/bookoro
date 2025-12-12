import api from '@/lib/axios';
import { Booking } from '@/types/booking';

export const bookingsService = {
    async create(flightId: string) {
        const res = await api.post('/bookings', { flightId });
        return res.data;
    },

    async getUserBookings(): Promise<Booking[]> {
        const res = await api.get('/bookings/me');
        return res.data;
    },

    async cancelBooking(bookingId: string) {
        const res = await api.delete(`/bookings/${bookingId}`);
        return res.data;
    },
};
