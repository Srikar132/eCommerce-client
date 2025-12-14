"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, RefreshCw } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface EmailVerificationBannerProps {
  className?: string;
}

export default function EmailVerificationBanner({ className = "" }: EmailVerificationBannerProps) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [isResending, setIsResending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

//   useEffect(() => {
//     if(!user || user.emailVerified) {
//         console.log(user);
//         console.log("User is not authenticated or email is already verified");
//       setDismissed(true);
//     }
//   }, [user]);
  // Don't show if user is not authenticated, email is verified, or banner is dismissed
  if (!user || user.emailVerified || dismissed || pathname === '/' || pathname.startsWith('/category') || pathname.startsWith('/search')) {
    return null;
  }


  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      await authApi.resendVerification(user.email);
      toast.success("Verification email sent!", {
        description: `Check your inbox at ${user.email}`,
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to send verification email";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert className={` ${className}`}>
      <AlertCircle className="h-4 w-4 text-black-600" />
      <AlertTitle className="text-black-800">Email Verification Required</AlertTitle>
      <AlertDescription className="text-black-700">
        <div className="mt-2 space-y-3">
          <p>
            Please verify your email address to access all features. Check your inbox at{" "}
            <span className="font-medium">{user.email}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleResendVerification}
              disabled={isResending}
              className="bg-black-100 border-black-300 text-black-800 hover:bg-black-200 rounded-none"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Email
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissed(true)}
              className="text-black-800 hover:bg-black-200"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
