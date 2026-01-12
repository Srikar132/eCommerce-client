import { Suspense } from "react";
import EmailVerificationClient from "@/components/auth/email-verification-client";
import { Loader2 } from "lucide-react";

function VerificationLoader() {
  return (
    <div className="max-w-2xl mx-auto min-h-screen pt-10 p-5">
      <div className="bg-linear-to-r from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-8 space-y-6 text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Loading...
          </h1>
          <p className="text-foreground/70">
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