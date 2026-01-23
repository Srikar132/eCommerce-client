'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface OrderSuccessClientProps {
  orderNumber: string;
}

export default function OrderSuccessClient({ orderNumber }: OrderSuccessClientProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/account');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  // GSAP animations
  useGSAP(() => {
    const tl = gsap.timeline();

    // Animate checkmark with scale and rotation
    tl.from(checkmarkRef.current, {
      scale: 0,
      rotation: -180,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
      // Animate content fade in from bottom
      .from(contentRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.2')
      // Animate button
      .from(buttonRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.2')
      // Add a subtle bounce to checkmark
      .to(checkmarkRef.current, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      }, '-=0.2');

    // Continuous subtle floating animation for checkmark
    gsap.to(checkmarkRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  const handleGoToAccount = () => {
    router.replace('/account');
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-linear-to-b from-background via-background to-accent/10 flex items-center justify-center p-4"
    >
      <Card className="max-w-lg w-full border-border/50 shadow-2xl">
        <CardContent className="pt-12 pb-8 px-6 text-center space-y-8">
          {/* Animated Checkmark */}
          <div ref={checkmarkRef} className="flex justify-center">
            <div className="relative">
              {/* Outer ring with gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-primary to-primary/60 rounded-full blur-xl opacity-50" />
              
              {/* Checkmark icon */}
              <div className="relative bg-linear-to-br from-primary to-primary/80 rounded-full p-6">
                <CheckCircle2 className="h-20 w-20 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Order Placed Successfully! 🎉
            </h1>
            
            <p className="text-muted-foreground text-base md:text-lg">
              Thank you for your purchase! Your order has been confirmed.
            </p>

            {/* Order Number Card */}
            <Card className="bg-accent/30 border-primary/20">
              <CardContent className="py-4 px-6">
                <div className="flex items-center justify-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground font-medium">
                      Order Number
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {orderNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground pt-2">
              We've sent a confirmation email with your order details.
              <br />
              You can track your order from your account page.
            </p>
          </div>

          {/* Action Buttons */}
          <div ref={buttonRef} className="space-y-3 pt-4">
            <Button
              onClick={handleGoToAccount}
              size="lg"
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              View Order Details
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-xs text-muted-foreground">
              Redirecting to your account in <span className="font-semibold">5 seconds...</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}