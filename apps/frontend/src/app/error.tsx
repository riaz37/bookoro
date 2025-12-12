'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Something went wrong!</h2>
            <p className="mt-2 text-slate-600 mb-6">We apologize for the inconvenience.</p>
            <Button onClick={() => reset()} variant="secondary">
                Try again
            </Button>
        </div>
    );
}
