import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description: "Read the terms and conditions for using Nala Armoire. Learn about our policies, disclaimers, and user agreements.",
    openGraph: {
        title: "Terms & Conditions - Nala Armoire",
        description: "Read the terms and conditions for using Nala Armoire.",
        url: "https://nalaarmoire.com/terms",
    },
};

const Terms = () => {
    return (
        <section className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
                <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
                <p className="text-muted-foreground">
                    Please read these terms and conditions carefully before using our website.
                </p>
            </div>
        </section>
    );
}

export default Terms;
