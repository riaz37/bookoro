import { useState, useEffect, useCallback } from 'react';
import { flightsService, Flight, FlightFilters } from '@/services/flights.service';
import toast from 'react-hot-toast';

export { type Flight, type FlightFilters };

export function useFlights(filters?: FlightFilters) {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFlights = useCallback(async (searchFilters?: FlightFilters) => {
        setLoading(true);
        try {
            const data = await flightsService.getAll(searchFilters || filters);
            setFlights(data);
        } catch (err) {
            toast.error('Failed to load flights. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchFlights();
    }, [fetchFlights]);

    return { flights, loading, refetch: fetchFlights };
}
