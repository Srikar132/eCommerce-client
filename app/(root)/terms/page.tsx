import type { Metadata } from "next";
import BreadcrumbNavigation from "@/components/breadcrumb-navigation";

export const metadata: Metadata = {
    title: "Terms & Conditions - Nala Armoire",
    description: "Read the terms and conditions for using Nala Armoire. Learn about our policies, disclaimers, and user agreements.",
};

const termsSections = [
    {
        title: "1. Acceptance of Terms",
        content: "By accessing and using Nala Armoire (the \"Website\"), you agree to be bound by these Terms and Conditions. Our platform is a space where dreams are stitched alive, and we expect our users to interact with our brand with the same respect and care that we put into every thread."
    },
    {
        title: "2. Artisanal Nature & Variations",
        content: "Each Nala Armoire piece is handcrafted with love and meticulous attention to detail. Due to the artisanal nature of our embroidery and stitching, slight variations in color, texture, and finish are to be expected. These are not defects but rather the unique signatures of a hand-made memory."
    },
    {
        title: "3. Custom Orders & Customizations",
        content: "We specialize in bringing your personal stories to life. For custom orders, the design process begins only after payment confirmation. Once a design is approved and stitching has commenced, no further modifications or cancellations can be made. We reserve the right to refuse customization requests that conflict with our brand values or intellectual property."
    },
    {
        title: "4. Pricing & Payments",
        content: "All prices listed on the website are in Indian Rupees (INR). We currently operate on a prepaid-only model to ensure the security and commitment required for artisanal production. Prices are subject to change without prior notice, but will not affect orders already confirmed."
    },
    {
        title: "5. Intellectual Property",
        content: "The Website and its original content, including but not limited to hand-stitch patterns, designs, photography, and the NaLa brand story, are the sole property of Nala Armoire. You may not reproduce, distribute, or create derivative works from our designs without explicit written consent."
    },
    {
        title: "6. Shipping & Risk of Loss",
        content: "We strive to deliver your memories safely. While we partner with reliable logistics providers, the risk of loss or damage passes to the customer upon delivery. Please inspect your package upon arrival and contact us immediately if any external damage is visible."
    },
    {
        title: "7. Limitation of Liability",
        content: "Nala Armoire shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our products. Our clothing is designed for emotional value and aesthetic beauty; please follow our care instructions to ensure longevity."
    },
    {
        title: "8. Governing Law",
        content: "These Terms shall be governed and construed in accordance with the laws of India. Any disputes arising from the use of this website will be subject to the exclusive jurisdiction of the courts in [Your City/State]."
    }
];

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
                {/* Header */}
                <div className="mb-16">
                    <div className="mb-8">
                        <BreadcrumbNavigation />
                    </div>
                    <div className="space-y-4">
                        <h1 className="h1 italic">Terms & Conditions</h1>
                        <div className="flex items-center gap-3 text-muted-foreground/60">
                            <span className="w-12 h-[1px] bg-muted-foreground/20" />
                            <p className="text-xs uppercase tracking-widest font-bold">Last Updated: April 2024</p>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-16">
                    <div className="p-base text-muted-foreground leading-relaxed italic">
                        &quot;Welcome to Nala Armoire. These terms govern your journey with us as we weave
                        your memories into reality. Please read them carefully as they define our
                        commitment to you and yours to us.&quot;
                    </div>

                    <div className="grid gap-12">
                        {termsSections.map((section, index) => (
                            <div key={index} className="group space-y-4">
                                <h2 className="h3 !text-2xl transition-colors group-hover:text-accent">
                                    {section.title}
                                </h2>
                                <p className="p-base text-muted-foreground leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Closing Statement */}
                <div className="mt-24 pt-12 border-t border-accent/10">
                    <p className="p-sm text-muted-foreground/50 text-center italic">
                        By continuing to use our site, you acknowledge that you have read and understood these terms.
                        Thank you for being part of the NaLa Story.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TermsPage;
