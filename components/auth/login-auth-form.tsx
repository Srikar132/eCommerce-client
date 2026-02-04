"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { sendOtp, loginWithOtp } from "@/lib/actions/auth-actions";
import { Loader2, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Step = 'phone' | 'otp';

// Phone validation schema with terms acceptance
const phoneSchema = z.object({
    fullPhone: z
        .string()
        .min(13, 'Please enter country code and phone number')
        .regex(/^\+\d{1,4}\d{10}$/, 'Invalid format. Use +91 followed by 10 digits'),
    acceptTerms: z
        .boolean()
        .refine((val) => val === true, {
            message: "You must accept the terms and conditions",
        }),
});

// OTP validation schema
const otpSchema = z.object({
    otp: z
        .string()
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function LoginAuthForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);

    const [step, setStep] = useState<Step>('phone');
    const [phoneData, setPhoneData] = useState({ phone: '', countryCode: '+91' });
    const [maskedPhone, setMaskedPhone] = useState('');

    // Phone form
    const phoneForm = useForm<PhoneFormValues>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            fullPhone: '+91',
            acceptTerms: false,
        },
    });

    // OTP form
    const otpForm = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
        },
        mode: 'onChange',
    });

    const handleSendOtp = async (data: PhoneFormValues) => {
        setIsLoading(true);
        try {
            const match = data.fullPhone.match(/^(\+\d{1,4})(\d{10})$/);
            if (!match) {
                toast.error('Invalid phone format');
                return;
            }

            const [, countryCode, phone] = match;
            const fullPhone = countryCode + phone;

            const response = await sendOtp(fullPhone);
            
            if (!response.success) {
                toast.error(response.error || 'Failed to send OTP');
                return;
            }

            setPhoneData({ phone, countryCode });
            const masked = phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3');
            setMaskedPhone(masked);

            toast.success(response.message || 'OTP sent successfully');
            otpForm.reset();
            setStep('otp');
        } catch (error) {
            console.error('Send OTP error:', error);
            toast.error('Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (data: OtpFormValues) => {
        setIsLoading(true);
        try {

            console.log('Verifying OTP for phone:', phoneData);
            const fullPhone = phoneData.countryCode + phoneData.phone;
            const response = await loginWithOtp(fullPhone, data.otp);
            
            if (!response.success) {
                toast.error('error' in response ? response.error : 'Verification failed');
                return;
            }

            toast.success('Login successful!');
            
            // Get redirect from URL or default to home
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect') || '/';
            
            startTransition(() => {
                router.push(redirect);
                router.refresh();
            });

            
        } catch (error) {
            console.error('Verify OTP error:', error);
            toast.error('Failed to verify OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            const fullPhone = phoneData.countryCode + phoneData.phone;
            const response = await sendOtp(fullPhone);
            
            if (!response.success) {
                toast.error(response.error || 'Failed to resend OTP');
                return;
            }

            toast.success('OTP resent successfully');
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.error('Failed to resend OTP');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            {step === 'phone' ? (
                <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
                        {/* Phone Number Field */}
                        <FormField
                            control={phoneForm.control}
                            name="fullPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-foreground mb-2">
                                        Phone Number
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            {/* Country Code Prefix - Static Display */}
                                            <div className="absolute left-0 top-0 h-11 px-3 flex items-center justify-center border-r border-border bg-muted/30 rounded-l-lg pointer-events-none z-10">
                                                <span className="text-sm font-medium text-muted-foreground">+91</span>
                                            </div>
                                            {/* Phone Number Input - Slimmer and elegant */}
                                            <Input
                                                placeholder="9876543210"
                                                value={field.value.replace(/^\+91/, "")}
                                                name={field.name}
                                                ref={field.ref}
                                                disabled={isLoading}
                                                onChange={(e) => {
                                                    const digits = e.target.value.replace(/\D/g, '');
                                                    field.onChange('+91' + digits);
                                                }}
                                                onBlur={field.onBlur}
                                                maxLength={10}
                                                className="h-11 pl-16 text-sm font-light tracking-wide border border-input bg-background focus-visible:border-primary focus-visible:ring-0 transition-colors placeholder:text-muted-foreground/60"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs font-medium text-destructive mt-1.5" />
                                </FormItem>
                            )}
                        />

                        {/* Terms & Conditions Checkbox */}
                        <FormField
                            control={phoneForm.control}
                            name="acceptTerms"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                    </FormControl>
                                    <div className="space-y-1">
                                        <FormLabel className="text-[11px] font-light text-muted-foreground cursor-pointer leading-relaxed block">
                                            By continuing, I agree to the{" "}
                                            <Link href="/terms" className="text-primary font-medium hover:underline underline-offset-2 whitespace-nowrap">
                                                Terms of Use
                                            </Link>
                                            {" "}&{" "}
                                            <Link href="/privacy" className="text-primary font-medium hover:underline underline-offset-2 whitespace-nowrap">
                                                Privacy Policy
                                            </Link>
                                            {" "}and I am above 18 years old.
                                        </FormLabel>
                                        <FormMessage className="text-[10px]" />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="font-light">Sending...</span>
                                </span>
                            ) : (
                                'Continue'
                            )}
                        </Button>
                    </form>
                </Form>
            ) : (
                <Form {...otpForm} key="otp-form" >
                    <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                        {/* OTP Info Header */}
                        <div className="text-center space-y-2 pb-2">
                            <p className="text-sm text-muted-foreground">
                                We've sent a verification code to
                            </p>
                            <p className="text-base font-semibold text-foreground">
                                {maskedPhone}
                            </p>
                        </div>

                        {/* OTP Input Field */}
                        <FormField
                            control={otpForm.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter OTP"
                                            value={field.value}
                                            disabled={isLoading}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                field.onChange(value);
                                            }}
                                            maxLength={6}
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            className="h-11 border border-input bg-background text-lg text-center tracking-[0.5em] font-medium focus-visible:border-primary focus-visible:ring-0 transition-colors placeholder:text-muted-foreground/50 placeholder:tracking-widest placeholder:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs font-medium text-destructive mt-1.5 text-center" />
                                </FormItem>
                            )}
                        />

                        {/* Action Links */}
                        <div className="flex items-center justify-between text-sm pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep('phone');
                                    otpForm.reset();
                                }}
                                disabled={isLoading}
                                className="font-light text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 underline-offset-2 hover:underline"
                            >
                                ← Change number
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isLoading}
                                className="font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 uppercase text-xs tracking-wide underline-offset-2 hover:underline"
                            >
                                Resend Code
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="font-light">Verifying...</span>
                                </span>
                            ) : (
                                'Verify & Continue'
                            )}
                        </Button>
                    </form>
                </Form>
            )}
        </>
    );
}