"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 mt-1 shrink-0" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-900">
                Registration Successful!
              </h3>
              <p className="text-green-700">
                Your account has been created successfully.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-900">
                Verify Your Email
              </h3>
              <p className="text-blue-700">
                We've sent a verification link to{" "}
                <span className="font-semibold">{userEmail}</span>
              </p>
              <p className="text-sm text-blue-600">
                Please check your inbox and click the verification link to activate your
                account.
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <p className="text-sm text-blue-800 font-medium">
              Didn't receive the email?
            </p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes for the email to arrive</li>
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
            className="w-full mt-4"
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend Verification Email"}
          </Button>
        </div>

        <Button
          onClick={() => (window.location.href = "/login")}
          className="w-full"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  // Show registration form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form space-y-4">
      <div className="auth-input-group">
        <div className="auth-input-wrapper">
          <Label className="auth-label-floating">Username</Label>
          <Input
            type="text"
            autoComplete="username"
            {...register("username")}
            className="auth-input"
            aria-invalid={!!errors.username}
          />
        </div>
        {errors.username && <p className="auth-error-text">{errors.username.message}</p>}
      </div>

      <div className="auth-input-group">
        <div className="auth-input-wrapper">
          <Label className="auth-label-floating">Email</Label>
          <Input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="auth-input"
            aria-invalid={!!errors.email}
          />
        </div>
        {errors.email && <p className="auth-error-text">{errors.email.message}</p>}
      </div>

      <div className="auth-input-group">
        <div className="auth-input-wrapper relative">
          <Label className="auth-label-floating">Phone</Label>
          <div className="flex items-center gap-2">
            <Input
              type="tel"
              autoComplete="tel"
              {...register("phone")}
              className="auth-input"
              aria-invalid={!!errors.phone}
            />
          </div>
        </div>
        {errors.phone && <p className="auth-error-text">{errors.phone.message}</p>}
      </div>

      <div className="auth-input-group">
        <div className="auth-input-wrapper">
          <Label className="auth-label-floating">Password</Label>
          <Input
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className="auth-input"
            aria-invalid={!!errors.password}
          />
        </div>
        {errors.password && <p className="auth-error-text">{errors.password.message}</p>}
      </div>

      <div className="auth-input-group">
        <div className="auth-input-wrapper">
          <Label className="auth-label-floating">Confirm Password</Label>
          <Input
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="auth-input"
            aria-invalid={!!errors.confirmPassword}
          />
        </div>
        {errors.confirmPassword && (
          <p className="auth-error-text">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="auth-submit-btn w-full" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}