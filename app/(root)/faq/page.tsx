import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import BreadcrumbNavigation from "@/components/breadcrumb-navigation";
import ScrollingBanner from "@/components/landing-page/scrolling-banner";
import CustomButton from "@/components/ui/custom-button-2";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ - Nala Armoire",
    description: "Answers to commonly asked questions about orders, shipping, returns, and customizations.",
};

const faqs = [
    {
        category: "Orders & Customizations",
        items: [
            {
                question: "How do I place a custom order?",
                answer: "Reach out to us via the Contact page with your idea — a reference image, color preference, or just a feeling. We'll get back to you within 24 hours to discuss details, pricing, and timelines."
            },
            {
                question: "Can I cancel my order?",
                answer: "Orders for non-customized items can be cancelled within 24 hours of placement. Customized orders cannot be cancelled once the crafting process has begun."
            }
        ]
    },
    {
        category: "Shipping & Delivery",
        items: [
            {
                question: "How long does shipping take?",
                answer: "Standard delivery takes 5–7 business days across India. Customized pieces may take an additional 3–5 days for crafting. Once dispatched, you'll receive a tracking link via email."
            },
            {
                question: "Do you ship internationally?",
                answer: "Currently, we ship within India only. We're working on expanding internationally — follow our Instagram @nala_armoire for updates."
            },
            {
                question: "What are the shipping charges?",
                answer: "We offer free shipping on all orders above ₹1999. For orders below that, a flat shipping fee of ₹99 is applicable."
            }
        ]
    },
    {
        category: "Returns & Refunds",
        items: [
            {
                question: "What is your return policy?",
                answer: "We accept returns within 7 days of delivery for non-customized items in original condition. Customized pieces are non-returnable unless there is a manufacturing defect."
            },
            {
                question: "How do I request a refund?",
                answer: "Drop us an email at support@nala-armoire.com with your order number and reason for return. Once approved, the refund will be processed to your original payment method within 5-7 working days."
            }
        ]
    },
    {
        category: "Product Care",
        items: [
            {
                question: "How do I care for my embroidered garments?",
                answer: "We recommend gentle hand wash or professional dry cleaning to preserve the life of the hand-stitching. Iron on reverse or use a pressing cloth for best results."
            }
        ]
    }
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
                {/* Header Section */}
                <div className="mb-14">
                    <div className="mb-8">
                        <BreadcrumbNavigation />
                    </div>
                    <div className="text-left space-y-4">
                        <h1 className="h1 italic">Frequently Asked Questions</h1>
                        <p className="p-base text-muted-foreground max-w-2xl leading-relaxed">
                            Everything you need to know about our artisanal process, shipping policies,
                            and how we bring your memories to life through stitches.
                        </p>
                    </div>
                </div>

                {/* FAQ Accordions */}
                <div className="space-y-12">
                    {faqs.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-6">
                            <h2 className="text-xs tracking-[0.3em] uppercase text-accent font-bold px-2">
                                {group.category}
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {group.items.map((faq, faqIdx) => (
                                    <AccordionItem
                                        key={faqIdx}
                                        value={`item-${groupIdx}-${faqIdx}`}
                                        className="border-none bg-accent/5 rounded-[2rem] px-6 transition-all hover:bg-accent/10 data-[state=open]:bg-accent/10"
                                    >
                                        <AccordionTrigger className="h3 !text-lg md:!text-xl py-6 hover:no-underline text-left">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="p-base text-muted-foreground pb-8 leading-relaxed">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                {/* Still have questions? */}
                <div className="mt-24 p-10 md:p-16 bg-foreground text-background rounded-[3rem] text-center space-y-6">
                    <h2 className="h2 !text-background">Still have questions?</h2>
                    <p className="p-base text-background/70 max-w-xl mx-auto">
                        Can&apos;t find the answer you&apos;re looking for? Reach out to our
                        customer care team and we&apos;ll be happy to help.
                    </p>
                    <div className="pt-4 flex justify-center">
                        <CustomButton
                            href="/contact"
                            bgColor="#ffffff"
                            fillColor="#000000"
                            textColor="#000000"
                            textHoverColor="#ffffff"
                        >
                            Contact Support
                        </CustomButton>
                    </div>
                </div>
            </div>

            {/* Footer Banner */}
            <div className="mt-20">
                <ScrollingBanner />
            </div>
        </div>
    );
}