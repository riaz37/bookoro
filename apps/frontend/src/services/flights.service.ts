import api from '@/lib/axios';
import { Flight, FlightFilters } from '@/types/flight';

export const flightsService = {
    async getAll(filters?: FlightFilters): Promise<Flight[]> {
        const params = new URLSearchParams();
        if (filters?.origin) params.append('origin', filters.origin);
        if (filters?.destination) params.append('destination', filters.destination);
        if (filters?.date) params.append('date', filters.date);
        if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

        const queryString = params.toString();
        const url = queryString ? `/flights?${queryString}` : '/flights';
        const res = await api.get(url);
        return res.data;
    },

    async getOne(id: string) {
        // Placeholder if backend supported GET /flights/:id
        return null;
    }
};
