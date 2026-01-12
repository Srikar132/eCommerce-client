"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, RefreshCw, X } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface EmailVerificationBannerProps {
  className?: string;
}

export default function EmailVerificationBanner({ 
  className = "" 
}: EmailVerificationBannerProps) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [isResending, setIsResending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state when user changes
  useEffect(() => {
    setDismissed(false);
  }, [user?.id]);

  // Don't show if:
  // 1. No user
  // 2. Email is verified
  // 3. Banner is dismissed
  // 4. On auth pages (login, register, verify-email)
  // 5. On public pages (home, category, search, product, contact)
  if (
    !user || 
    user.emailVerified || 
    dismissed ||
    pathname === '/' ||
    pathname.startsWith('/category') ||
    pathname.startsWith('/search') ||
    pathname.startsWith('/product') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/verify-email') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/about')
  ) {
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
      const message = error?.response?.data?.message || 
        "Failed to send verification email";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert className={`relative border-2 border-primary/20 bg-linear-to-r from-primary/5 to-accent/5 backdrop-blur-sm ${className}`}>
      <AlertCircle className="h-5 w-5 text-primary" />
      
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-primary/10 p-1"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <AlertTitle className="text-foreground font-semibold text-base">
        Email Verification Required
      </AlertTitle>
      
      <AlertDescription className="text-muted-foreground">
        <div className="mt-2 space-y-3">
          <p className="text-sm leading-relaxed">
            Please verify your email address to access all features. 
            Check your inbox at{" "}
            <span className="font-semibold text-foreground">{user.email}</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleResendVerification}
              disabled={isResending}
              className="border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-medium rounded-xl"
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
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}