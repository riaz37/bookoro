'use client';

import { Button } from '@/components/ui/Button';
import { Search, X, MapPin, Calendar, DollarSign, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { FlightFilters } from '@/hooks/useFlights';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [expandedSections, setExpandedSections] = useState({
        location: true,
        date: true,
        price: true,
    });

    const hasFilters = Object.values(filters).some(v => v !== undefined && v !== '');

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const activeFilters = [
        filters.origin && { key: 'origin', label: `From: ${filters.origin}`, value: filters.origin },
        filters.destination && { key: 'destination', label: `To: ${filters.destination}`, value: filters.destination },
        filters.date && { key: 'date', label: `Date: ${filters.date}`, value: filters.date },
        filters.maxPrice && { key: 'maxPrice', label: `Max: $${filters.maxPrice}`, value: filters.maxPrice },
    ].filter(Boolean);

    const removeFilter = (key: string) => {
        onFiltersChange({ ...filters, [key]: undefined });
    };

    const quickFilters = [
        { label: 'Today', action: () => onFiltersChange({ ...filters, date: new Date().toISOString().split('T')[0] }) },
        { label: 'Under $200', action: () => onFiltersChange({ ...filters, maxPrice: 200 }) },
        { label: 'Under $500', action: () => onFiltersChange({ ...filters, maxPrice: 500 }) },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`h-full flex flex-col ${isMobile ? 'bg-white' : ''}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-200/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                            <SlidersHorizontal className="text-white" size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Filters</h3>
                    </div>
                    {isMobile && onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {activeFilters.map((filter: any) => (
                            <motion.span
                                key={filter.key}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                            >
                                {filter.label}
                                <button
                                    onClick={() => removeFilter(filter.key)}
                                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </motion.span>
                        ))}
                    </div>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Quick Filters */}
                <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Quick Filters</h4>
                    <div className="flex flex-wrap gap-2">
                        {quickFilters.map((qf, idx) => (
                            <button
                                key={idx}
                                onClick={qf.action}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all hover:scale-105"
                            >
                                {qf.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location Section */}
                <FilterSection
                    title="Location"
                    icon={<MapPin size={18} />}
                    isExpanded={expandedSections.location}
                    onToggle={() => toggleSection('location')}
                >
                    <div className="space-y-4">
                        <FloatingLabelInput
                            label="Origin"
                            placeholder="e.g. NYC, JFK"
                            value={filters.origin || ''}
                            onChange={(value) => onFiltersChange({ ...filters, origin: value })}
                            icon={<MapPin size={16} className="text-slate-400" />}
                        />
                        <FloatingLabelInput
                            label="Destination"
                            placeholder="e.g. LAX, Los Angeles"
                            value={filters.destination || ''}
                            onChange={(value) => onFiltersChange({ ...filters, destination: value })}
                            icon={<MapPin size={16} className="text-slate-400" />}
                        />
                    </div>
                </FilterSection>

                {/* Date Section */}
                <FilterSection
                    title="Date & Time"
                    icon={<Calendar size={18} />}
                    isExpanded={expandedSections.date}
                    onToggle={() => toggleSection('date')}
                >
                    <FloatingLabelInput
                        label="Departure Date"
                        type="date"
                        value={filters.date || ''}
                        onChange={(value) => onFiltersChange({ ...filters, date: value })}
                        icon={<Calendar size={16} className="text-slate-400" />}
                    />
                </FilterSection>

                {/* Price Section */}
                <FilterSection
                    title="Price Range"
                    icon={<DollarSign size={18} />}
                    isExpanded={expandedSections.price}
                    onToggle={() => toggleSection('price')}
                >
                    <div className="space-y-3">
                        <FloatingLabelInput
                            label="Maximum Price"
                            type="number"
                            placeholder="e.g. 500"
                            value={filters.maxPrice?.toString() || ''}
                            onChange={(value) => onFiltersChange({ ...filters, maxPrice: value ? Number(value) : undefined })}
                            icon={<DollarSign size={16} className="text-slate-400" />}
                        />
                        {filters.maxPrice && (
                            <div className="text-sm text-slate-600">
                                Showing flights up to <span className="font-semibold text-blue-600">${filters.maxPrice}</span>
                            </div>
                        )}
                    </div>
                </FilterSection>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-200/50 bg-white space-y-3">
                <Button onClick={onSearch} className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Search size={18} />
                    Apply Filters
                </Button>
                {hasFilters && (
                    <Button onClick={onClear} variant="outline" className="w-full gap-2">
                        <X size={18} />
                        Clear All Filters
                    </Button>
                )}
            </div>
        </motion.div>
    );
}

// Collapsible Section Component
function FilterSection({ title, icon, isExpanded, onToggle, children }: {
    title: string;
    icon: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="text-blue-600">{icon}</div>
                    <h4 className="font-semibold text-slate-900">{title}</h4>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} className="text-slate-400" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 border-t border-slate-100">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Input Component with Label
function FloatingLabelInput({ label, type = 'text', placeholder, value, onChange, icon }: {
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    icon?: React.ReactNode;
}) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={`w-full rounded-lg border-2 px-4 py-2.5 text-slate-900 transition-all outline-none ${icon ? 'pl-10' : ''
                        } ${isFocused
                            ? 'border-blue-500 ring-4 ring-blue-500/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                />
            </div>
        </div>
    );
}

