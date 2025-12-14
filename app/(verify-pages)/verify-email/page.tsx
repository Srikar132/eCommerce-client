import { Suspense } from "react";
import EmailVerificationClient from "@/components/auth/email-verification-client";
import { Loader2 } from "lucide-react";

function VerificationLoader() {
  return (
    <div className="max-w-2xl mx-auto min-h-screen pt-10 p-5">
      <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
          <p className="text-gray-600">
            Please wait while we load the verification page...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerificationLoader />}>
      <EmailVerificationClient />
    </Suspense>
  );
}