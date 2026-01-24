import { Card, CardContent } from "@/components/ui/card";

export function ReviewsSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="space-y-8">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="h-20 bg-muted animate-pulse rounded" />
                                <div className="h-40 bg-muted animate-pulse rounded" />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardContent className="pt-6 space-y-3">
                                    <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                                    <div className="h-4 bg-muted animate-pulse rounded w-full" />
                                    <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
