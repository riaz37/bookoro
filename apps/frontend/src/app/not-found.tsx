import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-center">
            <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">404</h1>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Page Not Found</h2>
            <p className="mt-4 mb-8 text-slate-600">Sorry, we couldn't find the page you were looking for.</p>
            <Button asChild size="lg">
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    );
}
