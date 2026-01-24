"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Phone, Loader2, ArrowRight, Sparkles, ShieldCheck, KeyRound } from "lucide-react";

type Step = 'phone' | 'otp';

// Phone validation schema - now validates the full number with country code
const phoneSchema = z.object({
    fullPhone: z
        .string()
        .min(13, 'Please enter country code and phone number')
        .regex(/^\+\d{1,4}\d{10}$/, 'Invalid format. Use +91 followed by 10 digits'),
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
    const { sendOtp, verifyOtp, isLoading } = useAuth();

    const [step, setStep] = useState<Step>('phone');
    const [phoneData, setPhoneData] = useState({ phone: '', countryCode: '+91' });
    const [maskedPhone, setMaskedPhone] = useState('');

    // Phone form
    const phoneForm = useForm<PhoneFormValues>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            fullPhone: '+91',
        },
    });

    // OTP form
    const otpForm = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
        },
    });

    const handleSendOtp = async (data: PhoneFormValues) => {
        try {
            // Extract country code and phone number
            const match = data.fullPhone.match(/^(\+\d{1,4})(\d{10})$/);
            if (!match) return;

            const [, countryCode, phone] = match;

            const response = await sendOtp({
                phone: countryCode + phone,
                countryCode
            });
            setPhoneData({ phone, countryCode });
            setMaskedPhone(response.maskedPhone || phone);
            setStep('otp');
        } catch (error) {
            console.error('Send OTP error:', error);
        }
    };

    const handleVerifyOtp = async (data: OtpFormValues) => {
        try {
            // Send full phone number with country code
            const fullPhone = phoneData.countryCode + phoneData.phone;
            await verifyOtp({
                phone: fullPhone,
                otp: data.otp
            });
        } catch (error) {
            console.error('Verify OTP error:', error);
        }
    };

    const handleResendOtp = async () => {
        try {
            await sendOtp({
                phone: phoneData.phone,
                countryCode: phoneData.countryCode
            });
        } catch (error) {
            console.error('Resend OTP error:', error);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        let value = e.target.value;

        // Always keep the + at the start
        if (!value.startsWith('+')) {
            value = '+' + value.replace(/\D/g, '');
        } else {
            // Keep the +, remove all other non-digits
            value = '+' + value.slice(1).replace(/\D/g, '');
        }

        field.onChange(value);
    };

    return (
        <>
            {step === 'phone' ? (
                <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
                        {/* Phone Number Field with Country Code */}
                        <FormField
                            control={phoneForm.control}
                            name="fullPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-primary" />
                                        Phone Number
                                    </FormLabel>
                                    <Input
                                        placeholder="+919876543210"
                                        value={field.value}
                                        name={field.name}
                                        ref={field.ref}
                                        disabled={isLoading}
                                        onChange={(e) => handlePhoneChange(e, field)}
                                        onBlur={field.onBlur}
                                        maxLength={16}
                                        className="h-12 rounded-2xl border-2 transition-all duration-200 border-border bg-background focus-visible:border-primary focus-visible:ring-primary/20 pl-4 pr-4 text-base placeholder:text-muted-foreground"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Enter country code followed by phone number (e.g., +919876543210)
                                    </p>
                                    <FormMessage className="text-sm font-medium animate-in slide-in-from-top-1 duration-200" />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-semibold text-base shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
                                    Send OTP
                                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            ) : (
                <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                        {/* OTP Info */}
                        <div className="text-center space-y-2 pb-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                We've sent a verification code to
                            </p>
                            <p className="text-base font-semibold text-foreground">
                                {maskedPhone}
                            </p>
                        </div>

                        {/* OTP Field */}
                        <FormField
                            control={otpForm.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <KeyRound className="h-4 w-4 text-primary" />
                                        One-Time Password
                                    </FormLabel>
                                    <Input
                                        placeholder="Enter 6-digit OTP"
                                        value={field.value}
                                        name={field.name}
                                        ref={field.ref}
                                        disabled={isLoading}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            field.onChange(value);
                                        }}
                                        onBlur={field.onBlur}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        className="h-12 rounded-2xl border-2 transition-all duration-200 border-border bg-background focus-visible:border-primary focus-visible:ring-primary/20 pl-4 pr-4 text-base text-center tracking-widest font-semibold placeholder:text-muted-foreground placeholder:tracking-normal placeholder:font-normal"
                                    />
                                    <FormMessage className="text-sm font-medium animate-in slide-in-from-top-1 duration-200" />
                                </FormItem>
                            )}
                        />

                        {/* Action Links */}
                        <div className="flex items-center justify-between text-sm">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep('phone');
                                    otpForm.reset();
                                }}
                                disabled={isLoading}
                                className="font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group disabled:opacity-50"
                            >
                                <ArrowRight className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
                                Change number
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isLoading}
                                className="font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                            >
                                Resend OTP
                            </button>
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
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
                                    Verify & Login
                                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            )}
        </>
    );
}