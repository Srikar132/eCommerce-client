'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentSectionProps {
  onCheckout: () => void;
  isProcessing?: boolean;
  isCheckingOut?: boolean;
  isVerifyingPayment?: boolean;
  error?: string;
  disabled?: boolean;
}

export default function PaymentSection({
  onCheckout,
  isProcessing,
  isCheckingOut,
  isVerifyingPayment,
  error,
  disabled,
}: PaymentSectionProps) {
  const isLoading = isProcessing || isCheckingOut || isVerifyingPayment;

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Method
        </CardTitle>
        <CardDescription>
          Secure payment powered by Razorpay
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Info */}
        <div className="bg-accent/30 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Secure Checkout
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your payment information is encrypted and secure. We support credit cards, 
                debit cards, UPI, net banking, and more payment methods.
              </p>
            </div>
          </div>

          {/* Payment Methods Icons */}
          <div className="flex items-center gap-3 pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">We accept:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-[10px] font-semibold px-2 py-1 bg-background rounded border border-border/50">
                VISA
              </div>
              <div className="text-[10px] font-semibold px-2 py-1 bg-background rounded border border-border/50">
                MASTERCARD
              </div>
              <div className="text-[10px] font-semibold px-2 py-1 bg-background rounded border border-border/50">
                UPI
              </div>
              <div className="text-[10px] font-semibold px-2 py-1 bg-background rounded border border-border/50">
                NETBANKING
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          disabled={disabled || isLoading}
          className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              {isCheckingOut && 'Creating Order...'}
              {isVerifyingPayment && 'Verifying Payment...'}
              {isProcessing && !isCheckingOut && !isVerifyingPayment && 'Processing...'}
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Proceed to Payment
            </>
          )}
        </Button>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure Payment</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <div className="flex items-center gap-1">
            <span>256-bit Encryption</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
