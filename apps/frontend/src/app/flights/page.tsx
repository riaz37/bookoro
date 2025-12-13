'use client';

import { useFlights, FlightFilters } from '@/hooks/useFlights';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FlightCard } from '@/components/flights/FlightCard';
import { SearchFilters } from '@/components/flights/SearchFilters';
import { FlightCardSkeleton } from '@/components/skeletons/FlightCardSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import Loading from '@/components/ui/Loading';

export default function FlightsPage() {
    const [filters, setFilters] = useState<FlightFilters>({});
    const [appliedFilters, setAppliedFilters] = useState<FlightFilters>({});
    const { flights, loading, refetch } = useFlights(appliedFilters);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const handleSearch = () => {
        setAppliedFilters(filters);
    };

    const handleClearFilters = () => {
        setFilters({});
        setAppliedFilters({});
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <PageHeader />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Let's find your next destination
                    </h2>
                    <p className="text-slate-600">Best deals for you today</p>
                </motion.div>

                {/* Top Filter Bar */}
                <div className="mb-8 sticky top-4 z-30">
                    <SearchFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        onSearch={handleSearch}
                        onClear={handleClearFilters}
                        isMobile={false} // The component now handles responsiveness internally via CSS classes
                    />
                </div>

                {/* Flight Results */}
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(6)].map((_, i) => (
                            <FlightCardSkeleton key={i} />
                        ))}
                    </div>
                ) : flights.length === 0 ? (
                    <EmptyState
                        icon={Plane}
                        title="No flights found"
                        description="Try adjusting your search filters to find more flights."
                        actionLabel="Clear Filters"
                        onAction={handleClearFilters}
                    />
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {flights.map((flight, index) => (
                            <FlightCard key={flight.id} flight={flight} index={index} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
