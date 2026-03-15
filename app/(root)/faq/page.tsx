import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ - The Nala Armoire",
    description: "Answers to commonly asked questions about orders, shipping, returns, and customizations.",
};

const faqs = [
    {
        question: "How do I place a custom order?",
        answer: "Reach out to us via the Contact page with your idea — a reference image, color preference, or just a feeling. We'll get back to you within 24 hours to discuss details, pricing, and timelines."
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 7 days of delivery for non-customized items. The product must be unused, unwashed, and in its original packaging. Customized pieces are non-returnable unless there is a defect on our end."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard delivery takes 5–7 business days across India. We ship prepaid orders only. Once dispatched, you'll receive a tracking link via WhatsApp or email."
    },
    {
        question: "Do you ship internationally?",
        answer: "Currently we ship within India only. We're working on expanding internationally — follow our Instagram for updates."
    },
    {
        question: "How do I track my order?",
        answer: "After placing your order, head to the Orders section in your account. You'll see real-time status and a tracking number once your order is dispatched."
    },
    {
        question: "Can I cancel my order?",
        answer: "Orders can be cancelled within 12 hours of placement. After that, production may have already started. To cancel, log in and visit the Orders page, or contact us directly."
    },
    {
        question: "What materials do you use?",
        answer: "We use premium fabrics including soft cotton, silk blends, and sustainable textiles depending on the product. Each product page lists the material. We prioritize skin-friendly, breathable fabrics."
    },
    {
        question: "How should I care for my NaLa piece?",
        answer: "Most of our pieces require gentle machine wash (cold) or hand wash. Avoid bleach and tumble drying. Care instructions are included on the product label and listed on each product page under Wash & Care."
    },
    {
        question: "Is payment secure?",
        answer: "Yes. We use Razorpay for all transactions, which is PCI-DSS compliant. We accept UPI, credit/debit cards, and net banking. We do not store your card details."
    },
    {
        question: "I have more questions — how do I reach you?",
        answer: "Use the Contact page to send us a message, or DM us on Instagram @the.nala.armoire. We typically respond within a few hours during business days."
    },
];

export default function FaqPage() {
    return (
        <section className="min-h-screen bg-background">
            <Header
                title="Frequently Asked Questions"
                subtitle="Everything you need to know about ordering, shipping, and customization."
            />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                <Accordion type="single" collapsible className="w-full space-y-2">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border border-border rounded-lg px-5 bg-card hover:bg-accent/20 transition-colors data-[state=open]:bg-accent/20"
                        >
                            <AccordionTrigger className="text-sm sm:text-base font-medium text-foreground hover:text-primary hover:no-underline py-4">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* Bottom CTA */}
                <div className="mt-12 text-center py-8 border border-dashed border-border rounded-2xl bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-3">
                        Didn't find your answer?
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </section>
    );
}