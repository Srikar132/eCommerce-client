
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});


type LoginForm = z.infer<typeof loginSchema>;


export default function LoginAuthForm() {

    const { login , isLoading  } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });


    return (
        <form onSubmit={handleSubmit(login)} className="space-y-6">
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
                        {...register('email')}
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
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        {...register('password')}
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

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
                <Link 
                    href="/forgot-password" 
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
                >
                    Forgot your password?
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
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
                        Logging in...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
                        Login to Your Account
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </Button>
        </form>   
    );
}