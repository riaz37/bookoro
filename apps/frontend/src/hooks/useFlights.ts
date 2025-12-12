import { useQuery } from '@tanstack/react-query';
import { flightsService } from '@/services/flights.service';
import { Flight, FlightFilters } from '@/types/flight';

export type { Flight, FlightFilters };

export function useFlights(filters?: FlightFilters) {
    const { data: flights = [], isLoading, refetch } = useQuery({
        queryKey: ['flights', filters],
        queryFn: () => flightsService.getAll(filters),
    });

    return {
        flights,
        loading: isLoading,
        refetch,
    };
}
