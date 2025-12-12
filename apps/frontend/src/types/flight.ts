export interface Flight {
    id: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    seats: number;
    availableSeats?: number;
}

export interface FlightFilters {
    origin?: string;
    destination?: string;
    date?: string;
    minPrice?: number;
    maxPrice?: number;
}
