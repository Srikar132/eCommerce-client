


// import { EditAccountDetailsForm } from "@/components/account/edit-account-details-form";
import { Suspense } from "react";

export default function AccountDetailsPage() {



  return (
    <div className=" mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Account Details</h1>
        <p className="text-sm text-muted-foreground">
          View and update your account information
        </p>
      </div>


      <Suspense fallback={<div>Loading...</div>}>
        {/* <EditAccountDetailsForm  /> */}
      </Suspense>
    </div>
  );
}