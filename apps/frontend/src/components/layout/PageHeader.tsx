'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Plane, LogOut } from 'lucide-react';

export function PageHeader() {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/flights')}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                        <Plane size={20} className="fill-current" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">
                        Bookoro
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push('/flights')}
                        className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                    >
                        Flights
                    </button>
                    <button
                        onClick={() => router.push('/bookings')}
                        className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                    >
                        My Bookings
                    </button>
                    <div className="hidden text-sm text-slate-600 md:block">
                        {user?.name || user?.email}
                    </div>
                    <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Sign out</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
