export interface Booking {
    id: string;
    flightId: string;
    userId: string;
    status: 'CONFIRMED' | 'CANCELLED';
    createdAt: string;
    flight?: any;
}
