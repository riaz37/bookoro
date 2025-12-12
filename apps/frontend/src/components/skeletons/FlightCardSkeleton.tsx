import { Card, CardContent } from '@/components/ui/Card';

export function FlightCardSkeleton() {
    return (
        <Card className="group relative overflow-hidden animate-pulse">
            {/* Ticket Notch Effect */}
            <div className="absolute -left-3 top-24 h-6 w-6 rounded-full bg-slate-50" />
            <div className="absolute -right-3 top-24 h-6 w-6 rounded-full bg-slate-50" />

            <div className="bg-gradient-to-r from-slate-200 to-slate-300 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-16 bg-slate-300 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-slate-300 rounded"></div>
                    </div>
                    <div className="h-6 w-6 bg-slate-300 rounded"></div>
                    <div className="text-right">
                        <div className="h-8 w-16 bg-slate-300 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-slate-300 rounded"></div>
                    </div>
                </div>
            </div>

            <CardContent className="space-y-4 bg-white p-6 pt-8">
                <div className="flex justify-between border-b border-slate-100 pb-4">
                    <div>
                        <div className="h-3 w-16 bg-slate-200 rounded mb-2"></div>
                        <div className="h-5 w-12 bg-slate-200 rounded mb-1"></div>
                        <div className="h-3 w-20 bg-slate-200 rounded"></div>
                    </div>
                    <div className="text-right">
                        <div className="h-3 w-12 bg-slate-200 rounded mb-2"></div>
                        <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                </div>

                <div className="h-10 w-full bg-slate-200 rounded-lg"></div>
            </CardContent>
        </Card>
    );
}
