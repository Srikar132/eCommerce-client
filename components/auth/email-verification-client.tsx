"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

type VerificationState = 'verifying' | 'success' | 'error' | 'invalid-token';

interface VerificationError {
  message: string;
  isTokenExpired: boolean;
  isTokenInvalid: boolean;
}

export default function EmailVerificationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<VerificationState>('verifying');
  const [error, setError] = useState<VerificationError | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [userEmail] = useState<string>('');

  useEffect(() => {
    // If no token, show invalid token state
    if (!token || typeof token !== 'string') {
      setState('invalid-token');
      return;
    }

    // Verify the email token
    verifyEmailToken(token);
  }, [token]);

  const verifyEmailToken = async (verificationToken: string) => {
    setState('verifying');
    try {
      await authApi.verifyEmail(verificationToken);
      setState('success');
      
      // Show success toast
      toast.success("Email verified successfully!", {
        description: "You can now access all features of your account.",
        duration: 5000,
      });

      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'An unexpected error occurred during email verification.';
      
      const isTokenExpired = errorMessage.toLowerCase().includes('expired');
      const isTokenInvalid = errorMessage.toLowerCase().includes('invalid');
      
      setError({
        message: errorMessage,
        isTokenExpired,
        isTokenInvalid
      });
      setState('error');
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) {
      // Prompt for email if we don't have it
      router.push('/resend-verification');
      return;
    }

    setIsResending(true);
    try {
      await authApi.resendVerification(userEmail);
      toast.success("New verification email sent!", {
        description: `Check your inbox at ${userEmail}`,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || "Failed to send verification email";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  // Verifying state
  if (state === 'verifying') {
    return (
      <div className="max-w-2xl mx-auto min-h-screen pt-10 p-5">
        <div className="bg-linear-to-r from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-8 space-y-6 text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Verifying Your Email
            </h1>
            <p className="text-foreground/70">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (state === 'invalid-token') {
    return (
      <div className="max-w-2xl mx-auto min-h-screen pt-10 p-5">
        <div className="bg-linear-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-900">Invalid Verification Link</h1>
            <p className="mt-2 text-red-700">
              The verification link is invalid or missing a token. Please check your email and try again.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center h-12 bg-red-600 text-white px-6 rounded-2xl hover:bg-red-700 transition-all duration-200 hover:scale-[1.02] font-semibold shadow-lg hover:shadow-xl"
            >
              Go to Login
            </Link>
            <Link 
              href="/resend-verification" 
              className="inline-flex items-center justify-center h-12 bg-muted text-foreground px-6 rounded-2xl hover:bg-muted/80 transition-all duration-200 hover:scale-[1.02] font-semibold border-2 border-border"
            >
              Get New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (state === 'success') {
    return (
      <div className="max-w-2xl mx-auto min-h-screen pt-10 p-5">
        <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-900">Email Verified Successfully!</h1>
            <p className="mt-2 text-green-700">
              Your email has been successfully verified. You can now access all features of your account.
            </p>
          </div>
          
          <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-4">
            <p className="text-green-800 text-sm text-center font-medium">
              🎉 You will be redirected to the account page in a few seconds...
            </p>
          </div>

          <div className="text-center">
            <Link 
              href="/account" 
              className="inline-flex items-center justify-center h-12 bg-green-600 text-white px-8 rounded-2xl hover:bg-green-700 transition-all duration-200 hover:scale-[1.02] font-semibold shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30"
            >
              Continue to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state === 'error' && error) {
    return (
      <div className="max-w-2xl mx-auto min-h-screen pt-10 p-5">
        <div className="bg-linear-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-900">Verification Failed</h1>
            <p className="mt-2 text-red-700">{error.message}</p>
          </div>

          {/* Show different actions based on error type */}
          {(error.isTokenExpired || error.isTokenInvalid) && (
            <div className="bg-linear-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-xl">
                    <RefreshCw className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-900">
                    {error.isTokenExpired ? "Token Expired" : "Invalid Token"}
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    {error.isTokenExpired 
                      ? "Your verification link has expired. Request a new one to verify your email."
                      : "The verification token is invalid. Please request a new verification email."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center h-12 bg-red-600 text-white px-6 rounded-2xl hover:bg-red-700 transition-all duration-200 hover:scale-[1.02] font-semibold shadow-lg hover:shadow-xl"
            >
              Go to Login
            </Link>
            
            {(error.isTokenExpired || error.isTokenInvalid) && (
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="h-12 bg-muted text-foreground px-6 rounded-2xl hover:bg-muted/80 transition-all duration-200 hover:scale-[1.02] font-semibold border-2 border-border disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Get New Link
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }


  return null;
}
