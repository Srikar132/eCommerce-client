"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
    Configuration: "There was a problem with the server configuration. Please try again.",
    AccessDenied: "Access was denied. You may not have permission to sign in.",
    Verification: "The verification link has expired or has already been used.",
    OAuthSignin: "Could not start the sign-in process. Please try again.",
    OAuthCallback: "Something went wrong during sign-in. Please try again.",
    OAuthAccountNotLinked: "This email is already linked to another account. Please use the original sign-in method.",
    Default: "An unexpected error occurred. Please try again.",
};

export default function LoginAuthForm() {
    
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showTermsError, setShowTermsError] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // Handle OAuth error callback params
    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            setAuthError(AUTH_ERROR_MESSAGES[error] || AUTH_ERROR_MESSAGES.Default);
        }
    }, [searchParams]);

    const handleGoogleSignIn = async () => {
        if (!acceptTerms) {
            setShowTermsError(true);
            return;
        }

        setAuthError(null);
        setIsLoading(true);
        try {
            const redirectParam = searchParams.get("redirect");

            await signIn("google", {
                callbackUrl: redirectParam || "/account",
            });
        } catch (error) {
            console.error("Google sign-in error:", error);
            setAuthError("Failed to initiate sign-in. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Auth Error Banner */}
            {authError && (
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-destructive/5 border border-destructive/20 text-sm">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-foreground font-medium text-xs">Sign-in failed</p>
                        <p className="text-muted-foreground text-xs font-light">{authError}</p>
                    </div>
                </div>
            )}

            {/* Google Sign-In Button */}
            <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 border-2 border-input bg-background hover:bg-accent/50 text-foreground font-medium text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm rounded-lg"
            >
                {isLoading ? (
                    <span className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-light">Signing in...</span>
                    </span>
                ) : (
                    <span className="flex items-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </span>
                )}
            </Button>

            {/* Terms & Conditions Checkbox */}
            <div className="flex flex-row items-start space-x-3">
                <Checkbox
                    id="acceptTerms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => {
                        setAcceptTerms(checked === true);
                        if (checked) setShowTermsError(false);
                    }}
                    className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="space-y-1">
                    <Label
                        htmlFor="acceptTerms"
                        className="text-[11px] font-light text-muted-foreground cursor-pointer leading-relaxed block"
                    >
                        By continuing, I agree to the{" "}
                        <Link
                            href="/terms"
                            className="text-primary font-medium hover:underline underline-offset-2 whitespace-nowrap"
                        >
                            Terms of Use
                        </Link>
                        {" "}&{" "}
                        <Link
                            href="/privacy"
                            className="text-primary font-medium hover:underline underline-offset-2 whitespace-nowrap"
                        >
                            Privacy Policy
                        </Link>
                    </Label>
                    {showTermsError && (
                        <p className="text-[10px] font-medium text-destructive">
                            You must accept the terms and conditions
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}