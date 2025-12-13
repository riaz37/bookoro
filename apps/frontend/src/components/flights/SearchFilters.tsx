'use client';

import { Button } from '@/components/ui/Button';
import { Search, MapPin, Calendar, DollarSign, X } from 'lucide-react';
import { FlightFilters } from '@/hooks/useFlights';
import { useState } from 'react';

interface SearchFiltersProps {
    filters: FlightFilters;
    onFiltersChange: (filters: FlightFilters) => void;
    onSearch: () => void;
    onClear: () => void;
    isMobile?: boolean;
    onClose?: () => void;
}

export function SearchFilters({ filters, onFiltersChange, onSearch, onClear, isMobile = false, onClose }: SearchFiltersProps) {
    // We don't need expanded sections state anymore for the simple top bar

    const hasFilters = Object.values(filters).some(v => v !== undefined && v !== '');

    return (
        <div className={`bg-white rounded-2xl shadow-xl border border-slate-200/50 p-4 ${isMobile ? 'flex flex-col gap-4' : 'flex flex-wrap items-center gap-4'}`}>
            {/* Origin */}
            <div className="flex-1 min-w-[200px]">
                <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="From where?"
                        value={filters.origin || ''}
                        onChange={(e) => onFiltersChange({ ...filters, origin: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                    />
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-slate-500 group-focus-within:text-blue-500">
                        Origin
                    </label>
                </div>
            </div>

            {/* Destination */}
            <div className="flex-1 min-w-[200px]">
                <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="To where?"
                        value={filters.destination || ''}
                        onChange={(e) => onFiltersChange({ ...filters, destination: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                    />
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-slate-500 group-focus-within:text-blue-500">
                        Destination
                    </label>
                </div>
            </div>

            {/* Date */}
            <div className="flex-1 min-w-[180px]">
                <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="date"
                        value={filters.date || ''}
                        onChange={(e) => onFiltersChange({ ...filters, date: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                    />
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-slate-500 group-focus-within:text-blue-500">
                        Date
                    </label>
                </div>
            </div>

            {/* Price */}
            <div className="flex-1 min-w-[150px]">
                <div className="relative group">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice?.toString() || ''}
                        onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                    />
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-slate-500 group-focus-within:text-blue-500">
                        Budget
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 min-w-[120px]">
                <Button onClick={onSearch} className="flex-1 h-[46px] bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30">
                    Search
                </Button>
                {hasFilters && (
                    <button
                        onClick={onClear}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Clear filters"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}


