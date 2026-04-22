
import { Mail, Phone, Clock, ChevronRight } from 'lucide-react';
import { STORE_SETTINGS } from '@/constants';
import type { Metadata } from "next";
import BreadcrumbNavigation from '@/components/breadcrumb-navigation';
import ScrollingBanner from '@/components/landing-page/scrolling-banner';

import ContactForm from '@/components/contact/contact-form';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Nala Armoire. Wanna say hi? Here&apos;s where to find us &amp; when we&apos;re around!",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        <BreadcrumbNavigation />
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="h1 mb-4">Wanna Say Hi?</h1>
          <p className="p-base text-muted-foreground/70">
            Here&apos;s where to find us &amp; when we&apos;re around!
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Contact Form Column */}
          <div className="lg:col-span-8">
            <ContactForm />
          </div>

          {/* Information Column */}
          <div className="lg:col-span-4 lg:border-l lg:border-muted/30 lg:pl-16">
            <div className="space-y-12">
              <div>
                <h2 className="h2 !text-3xl mb-4">Information</h2>
                <p className="p-sm text-muted-foreground leading-relaxed max-w-xs">
                  Our location, phone number & business hours —right at your fingertips.
                </p>
              </div>

              <div className="space-y-10">
                {/* Support */}
                <div className="flex gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                    <Mail className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg">Support</h4>
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors cursor-pointer group/link">
                      <span className="text-sm border-b border-muted-foreground/30 group-hover/link:border-accent">
                        {STORE_SETTINGS.email}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-muted/20 flex items-center justify-center group-hover/link:bg-accent/20 transition-all">
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call Us */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg">Call Us</h4>
                    <p className="text-sm text-muted-foreground">
                      {STORE_SETTINGS.phone}
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg">Working Hour</h4>
                    <div className="text-sm text-muted-foreground space-y-1.5 pt-1">
                      <p>Mon – Fri, 7:30 AM – 4:00 PM PT</p>
                      <p>Sat, 8:00 AM – 1:00 PM PT</p>
                      <p>Sun, Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollingBanner />
    </main>
  );
}
