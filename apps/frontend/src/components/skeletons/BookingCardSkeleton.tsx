import { Card, CardContent } from '@/components/ui/Card';

export function BookingCardSkeleton() {
    return (
        <Card className="overflow-hidden animate-pulse">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                            <div className="h-4 w-4 bg-slate-200 rounded"></div>
                            <div className="h-4 w-32 bg-slate-200 rounded"></div>
                        </div>
                        <div className="mb-2">
                            <div className="h-6 w-40 bg-slate-200 rounded"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                            <div className="h-4 w-32 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                    <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
                </div>
            </CardContent>
        </Card>
    );
}
