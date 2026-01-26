import { Suspense } from "react";
import { EditAddressForm } from "@/components/account/edit-address-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditAddressPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <EditAddressForm />
      </Suspense>
    </div>
  );
}
