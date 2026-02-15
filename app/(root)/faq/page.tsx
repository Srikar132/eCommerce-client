import type { Metadata } from "next";
import { FAQSchema } from "@/components/shared/structured-data";

export const metadata: Metadata = {
    title: "FAQ",
    description: "Find answers to frequently asked questions about Nala Armoire - shipping, customization, orders, payments, and more.",
    openGraph: {
        title: "FAQ - Nala Armoire",
        description: "Find answers to frequently asked questions about Nala Armoire.",
        url: "https://nalaarmoire.com/faq",
    },
};

const faqItems = [
    {
        question: "How do I track my order?",
        answer: "You can track your order using the tracking link sent to your email after your order ships. You can also view order status in your account dashboard under 'Orders'.",
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 5-7 business days within India. Please note that customized orders may take additional time for preparation before shipping.",
    },
    {
        question: "Can I customize my order?",
        answer: "Yes! We specialize in customizable fashion. You can personalize many of our products with custom sizing, colors, and design elements. Look for the customization options on product pages.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept prepaid orders through Razorpay, which includes UPI, credit/debit cards, net banking, and popular wallets.",
    },
    {
        question: "Do you offer international shipping?",
        answer: "Currently, we ship within India. International shipping will be available soon. Please check back for updates.",
    },
    {
        question: "How can I contact customer support?",
        answer: "You can reach us through our Contact Us page, or email us directly. Our support team typically responds within 24-48 hours.",
    },
];

const FaqPage = () => {
    return (
        <section className="min-h-screen bg-background">
            <FAQSchema items={faqItems} />
            <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
                <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <div key={index} className="border-b pb-4">
                            <h2 className="text-xl font-semibold">{item.question}</h2>
                            <p className="text-muted-foreground">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


export default FaqPage;