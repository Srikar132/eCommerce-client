

"use client";

import { EditAccountDetailsForm } from "@/components/account/edit-account-details-form";
import { useAuthStore } from "@/lib/store/auth-store";
import { Loader2 } from "lucide-react";

export default function AccountDetailsPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className=" mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Account Details</h1>
        <p className="text-sm text-muted-foreground">
          View and update your account information
        </p>
      </div>

      {/* Form */}
      <EditAccountDetailsForm user={user} />
    </div>
  );
}