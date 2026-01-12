"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Mail, CheckCircle, User, Phone, Lock, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long")
      .regex(/^\+?[0-9]+$/, "Phone can only contain digits and optional leading +"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterAuthForm() {
  const { register: handleRegister, isLoading } = useAuth();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await handleRegister(data);
      setUserEmail(data.email);
      setRegistrationSuccess(true);
    } catch (error) {
      // Error is handled by useAuth hook
      console.error("Registration failed:", error);
    }
  };

  // Show success message after registration
  if (registrationSuccess) {
    return (
      <div className="space-y-6">
        {/* Success Alert */}
        <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-bold text-green-900">
                Registration Successful!
              </h3>
              <p className="text-sm text-green-700">
                Your account has been created successfully.
              </p>
            </div>
          </div>
        </div>

        {/* Email Verification Notice */}
        <div className="bg-linear-to-r from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-bold text-foreground">
                Verify Your Email
              </h3>
              <p className="text-sm text-muted-foreground">
                We've sent a verification link to{" "}
                <span className="font-semibold text-primary">{userEmail}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your inbox and click the verification link to activate your
                account.
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-3 border-t border-border/50">
            <p className="text-sm font-semibold text-foreground">
              Didn't receive the email?
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Check your spam or junk folder
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Make sure you entered the correct email address
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Wait a few minutes for the email to arrive
              </li>
            </ul>
          </div>

          <Button
            onClick={async () => {
              setIsResending(true);
              try {
                await authApi.resendVerification(userEmail);
                toast.success("Verification email sent!", {
                  description: `A new verification link has been sent to ${userEmail}`,
                });
              } catch (error: any) {
                const message = error?.response?.data?.message || "Failed to resend verification email";
                toast.error(message);
              } finally {
                setIsResending(false);
              }
            }}
            variant="outline"
            className="w-full h-12 rounded-2xl border-2 border-primary/30 hover:bg-primary/5 transition-all duration-200"
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </Button>
        </div>

        <Button
          onClick={() => (window.location.href = "/login")}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-semibold shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] group"
        >
          <ArrowRight className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Go to Login
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    );
  }

  // Show registration form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Username Field */}
      <div className="space-y-2">
        <Label 
          htmlFor="username" 
          className="text-sm font-semibold text-foreground flex items-center gap-2"
        >
          <User className="h-4 w-4 text-primary" />
          Username
        </Label>
        <div className="relative group">
          <Input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Choose a username"
            {...register("username")}
            className={`h-12 rounded-2xl border-2 transition-all duration-200 ${
              errors.username 
                ? 'border-destructive bg-destructive/5 focus-visible:ring-destructive/20' 
                : 'border-border bg-background focus-visible:border-primary focus-visible:ring-primary/20'
            } pl-4 pr-4 text-base placeholder:text-muted-foreground`}
          />
        </div>
        {errors.username && (
          <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1 duration-200">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label 
          htmlFor="email" 
          className="text-sm font-semibold text-foreground flex items-center gap-2"
        >
          <Mail className="h-4 w-4 text-primary" />
          Email Address
        </Label>
        <div className="relative group">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            className={`h-12 rounded-2xl border-2 transition-all duration-200 ${
              errors.email 
                ? 'border-destructive bg-destructive/5 focus-visible:ring-destructive/20' 
                : 'border-border bg-background focus-visible:border-primary focus-visible:ring-primary/20'
            } pl-4 pr-4 text-base placeholder:text-muted-foreground`}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1 duration-200">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label 
          htmlFor="phone" 
          className="text-sm font-semibold text-foreground flex items-center gap-2"
        >
          <Phone className="h-4 w-4 text-primary" />
          Phone Number
        </Label>
        <div className="relative group">
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1234567890"
            {...register("phone")}
            className={`h-12 rounded-2xl border-2 transition-all duration-200 ${
              errors.phone 
                ? 'border-destructive bg-destructive/5 focus-visible:ring-destructive/20' 
                : 'border-border bg-background focus-visible:border-primary focus-visible:ring-primary/20'
            } pl-4 pr-4 text-base placeholder:text-muted-foreground`}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1 duration-200">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label 
          htmlFor="password" 
          className="text-sm font-semibold text-foreground flex items-center gap-2"
        >
          <Lock className="h-4 w-4 text-primary" />
          Password
        </Label>
        <div className="relative group">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            {...register("password")}
            className={`h-12 rounded-2xl border-2 transition-all duration-200 ${
              errors.password 
                ? 'border-destructive bg-destructive/5 focus-visible:ring-destructive/20' 
                : 'border-border bg-background focus-visible:border-primary focus-visible:ring-primary/20'
            } pl-4 pr-4 text-base placeholder:text-muted-foreground`}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1 duration-200">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label 
          htmlFor="confirmPassword" 
          className="text-sm font-semibold text-foreground flex items-center gap-2"
        >
          <Lock className="h-4 w-4 text-primary" />
          Confirm Password
        </Label>
        <div className="relative group">
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            className={`h-12 rounded-2xl border-2 transition-all duration-200 ${
              errors.confirmPassword 
                ? 'border-destructive bg-destructive/5 focus-visible:ring-destructive/20' 
                : 'border-border bg-background focus-visible:border-primary focus-visible:ring-primary/20'
            } pl-4 pr-4 text-base placeholder:text-muted-foreground`}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1 duration-200">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-semibold text-base shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
            Create Account
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}