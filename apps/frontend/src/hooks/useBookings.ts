import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { bookingsService } from '@/services/bookings.service';
import { Booking } from '@/types/booking';
import toast from 'react-hot-toast';

export function useBookings() {
    const queryClient = useQueryClient();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: bookingsService.getUserBookings,
    });

    const createBooking = useMutation({
        mutationFn: bookingsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('Booking confirmed!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Booking failed');
        },
    });

    const cancelBooking = useMutation({
        mutationFn: bookingsService.cancelBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('Booking cancelled');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Cancellation failed');
        },
    });

    return {
        bookings,
        isLoading,
        createBooking: createBooking.mutate,
        isCreating: createBooking.isPending,
        cancelBooking: cancelBooking.mutate,
        isCancelling: cancelBooking.isPending,
    };
}

