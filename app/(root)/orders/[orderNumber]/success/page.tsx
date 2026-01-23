import { Suspense } from 'react';
import OrderSuccessClient from '@/components/order/order-success-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderSuccessPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  return (
    <Suspense fallback={<OrderSuccessPageSkeleton />}>
      <OrderSuccessClient orderNumber={params.orderNumber} />
    </Suspense>
  );
}

function OrderSuccessPageSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6 mx-auto" />
      </div>
    </div>
  );
}
