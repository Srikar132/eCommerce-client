import { Suspense } from "react";
import { EditAddressForm } from "@/components/account/edit-address-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditAddressPage() {
  return (
    <div className="container py-8">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <EditAddressForm />
      </Suspense>
    </div>
  );
}
