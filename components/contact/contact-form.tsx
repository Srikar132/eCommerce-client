"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CustomButton from '@/components/ui/custom-button';
import { submitContactForm } from "@/lib/actions/user-actions";

const initialState = {
    success: false,
    message: "",
    errors: {} as Record<string, string[]>,
};

export default function ContactForm() {




    const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message);
                // Clear form or redirect if needed
                const form = document.getElementById("contact-form") as HTMLFormElement;
                form?.reset();
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    return (
        <form id="contact-form" action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name */}
            <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-bold pl-1">Name</label>
                <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    className={`h-14 rounded-full border-none bg-[#F5F5F5] px-6 focus-visible:ring-1 focus-visible:ring-accent/20 ${state.errors?.name ? 'ring-1 ring-destructive' : ''}`}
                    required
                />
                {state.errors?.name && (
                    <p className="text-xs text-destructive pl-1">{state.errors.name[0]}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-bold pl-1">Email*</label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    className={`h-14 rounded-full border-none bg-[#F5F5F5] px-6 focus-visible:ring-1 focus-visible:ring-accent/20 ${state.errors?.email ? 'ring-1 ring-destructive' : ''}`}
                    required
                />
                {state.errors?.email && (
                    <p className="text-xs text-destructive pl-1">{state.errors.email[0]}</p>
                )}
            </div>

            {/* Phone Number */}
            <div className="space-y-3">
                <label htmlFor="phone" className="text-sm font-bold pl-1">Phone Number</label>
                <Input
                    id="phone"
                    name="phone"
                    placeholder="Optional"
                    className="h-14 rounded-full border-none bg-[#F5F5F5] px-6 focus-visible:ring-1 focus-visible:ring-accent/20"
                />
            </div>

            {/* Order Number */}
            <div className="space-y-3">
                <label htmlFor="orderNumber" className="text-sm font-bold pl-1">Order Number</label>
                <Input
                    id="orderNumber"
                    name="orderNumber"
                    placeholder="Optional"
                    className="h-14 rounded-full border-none bg-[#F5F5F5] px-6 focus-visible:ring-1 focus-visible:ring-accent/20"
                />
            </div>



            {/* Message */}
            <div className="md:col-span-2 space-y-3">
                <label htmlFor="message" className="text-sm font-bold pl-1">Your Message</label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    className={`min-h-[180px] rounded-[2rem] border-none bg-[#F5F5F5] p-6 focus-visible:ring-1 focus-visible:ring-accent/20 resize-none ${state.errors?.message ? 'ring-1 ring-destructive' : ''}`}
                    required
                />
                {state.errors?.message && (
                    <p className="text-xs text-destructive pl-1">{state.errors.message[0]}</p>
                )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 pt-4">
                <CustomButton
                    bgColor="#000000"
                    circleColor="#ffffff"
                    textColor="#ffffff"
                    textHoverColor="#000000"
                    circleSize={44}
                    className="min-w-[200px]"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? "Sending..." : "Send Message"}
                </CustomButton>
            </div>
        </form>
    );
}
