
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

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
        <form onSubmit={handleSubmit(login)} className="auth-form">
            <div className="auth-input-group">
                <div className="auth-input-wrapper">
                    <Label className="auth-label-floating">Email</Label>
                    <Input
                        type="email"
                        autoComplete="email"
                        {...register('email')}
                        className="auth-input"
                    />
                </div>
                {errors.email && <p className="auth-error-text">{errors.email.message}</p>}
            </div>

            <div className="auth-input-group">
                <div className="auth-input-wrapper">
                    <Label className="auth-label-floating">Password</Label>
                    <Input
                        type="password"
                        {...register('password')}
                        className="auth-input"
                    />
                </div>
                {errors.password && <p className="auth-error-text">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
                <Link 
                    href="/forgot-password" 
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                >
                    Forgot your password?
                </Link>
            </div>

            <Button type="submit" className="auth-submit-btn">
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>   
    );
}