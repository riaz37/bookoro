'use client';

import { useFlights, FlightFilters } from '@/hooks/useFlights';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FlightCard } from '@/components/flights/FlightCard';
import { SearchFilters } from '@/components/flights/SearchFilters';
import { FlightCardSkeleton } from '@/components/skeletons/FlightCardSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import Loading from '@/components/ui/Loading';

export default function FlightsPage() {
    const [filters, setFilters] = useState<FlightFilters>({});
    const [appliedFilters, setAppliedFilters] = useState<FlightFilters>({});
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const { flights, loading, refetch } = useFlights(appliedFilters);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const handleSearch = () => {
        setAppliedFilters(filters);
        setIsMobileFilterOpen(false); // Close mobile drawer after search
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
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-6">
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                        <SlidersHorizontal size={20} className="text-blue-600" />
                        <span className="font-semibold text-slate-900">Filters</span>
                        {Object.values(filters).filter(v => v).length > 0 && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                {Object.values(filters).filter(v => v).length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Layout Container */}
                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-8 max-h-[calc(100vh-4rem)] flex flex-col rounded-2xl overflow-hidden shadow-xl border border-slate-200/50 bg-white/80 backdrop-blur-xl">
                            <SearchFilters
                                filters={filters}
                                onFiltersChange={setFilters}
                                onSearch={handleSearch}
                                onClear={handleClearFilters}
                            />
                        </div>
                    </aside>

                    {/* Mobile Drawer */}
                    <AnimatePresence>
                        {isMobileFilterOpen && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                                />
                                {/* Drawer */}
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-hidden"
                                >
                                    <SearchFilters
                                        filters={filters}
                                        onFiltersChange={setFilters}
                                        onSearch={handleSearch}
                                        onClear={handleClearFilters}
                                        isMobile={true}
                                        onClose={() => setIsMobileFilterOpen(false)}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
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
                    </div>
                </div>
            </main>
        </div>
    );
}
