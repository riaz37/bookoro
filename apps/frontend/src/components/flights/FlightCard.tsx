'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plane, Clock, Calendar, Users, ArrowRight } from 'lucide-react';
import { Flight } from '@/hooks/useFlights';
import { motion } from 'framer-motion';

interface FlightCardProps {
    flight: Flight;
    index: number;
}

export function FlightCard({ flight, index }: FlightCardProps) {
    const router = useRouter();

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const getDuration = () => {
        const departure = new Date(flight.departureTime);
        const arrival = new Date(flight.arrivalTime);
        const diff = arrival.getTime() - departure.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    // Extract city codes from origin/destination
    const getCode = (location: string) => {
        const match = location.match(/\(([A-Z]{3})\)/);
        return match ? match[1] : location.slice(0, 3).toUpperCase();
    };

    const getCity = (location: string) => {
        return location.replace(/\s*\([A-Z]{3}\)\s*/, '').trim();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="h-full"
        >
            <Card className="group relative h-full flex flex-col overflow-hidden bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">
                {/* Top Gradient Bar */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                {/* Route Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Origin */}
                        <div className="flex-1 text-center">
                            <div className="text-3xl font-black tracking-tight text-slate-900">
                                {getCode(flight.origin)}
                            </div>
                            <div className="mt-1 text-sm font-medium text-slate-500 truncate">
                                {getCity(flight.origin)}
                            </div>
                        </div>

                        {/* Flight Path Visualization */}
                        <div className="flex flex-col items-center px-2">
                            <div className="text-xs font-semibold text-blue-600 mb-2">
                                {getDuration()}
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                <Plane className="h-4 w-4 text-indigo-500 -rotate-45" />
                                <div className="h-[2px] w-12 bg-gradient-to-r from-indigo-500 to-purple-500" />
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                            </div>
                            <div className="text-xs text-slate-400 mt-2">Direct</div>
                        </div>

                        {/* Destination */}
                        <div className="flex-1 text-center">
                            <div className="text-3xl font-black tracking-tight text-slate-900">
                                {getCode(flight.destination)}
                            </div>
                            <div className="mt-1 text-sm font-medium text-slate-500 truncate">
                                {getCity(flight.destination)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider with notches */}
                <div className="relative px-6">
                    <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
                    <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
                    <div className="border-t-2 border-dashed border-slate-200" />
                </div>

                {/* Flight Details */}
                <div className="flex-1 p-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Departure */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                                <Clock className="h-3 w-3" />
                                Departs
                            </div>
                            <div className="text-xl font-bold text-slate-900">
                                {formatTime(flight.departureTime)}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Calendar className="h-3 w-3" />
                                {formatDate(flight.departureTime)}
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="space-y-1 text-right">
                            <div className="flex items-center justify-end gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                                <ArrowRight className="h-3 w-3" />
                                Arrives
                            </div>
                            <div className="text-xl font-bold text-slate-900">
                                {formatTime(flight.arrivalTime)}
                            </div>
                            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500">
                                <Calendar className="h-3 w-3" />
                                {formatDate(flight.arrivalTime)}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <Users className="h-3 w-3" />
                            {flight.availableSeats || flight.seats} seats
                        </span>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            Economy
                        </span>
                    </div>
                </div>

                {/* Footer with Price & Button */}
                <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs font-medium text-slate-500 mb-0.5">Starting from</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">${flight.price}</span>
                                <span className="text-sm text-slate-500">/person</span>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105"
                            onClick={() => router.push(`/bookings/confirmation/${flight.id}?price=${flight.price}`)}
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
