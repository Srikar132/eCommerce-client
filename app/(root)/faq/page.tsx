

const FaqPage = () => {
    return (
        <section className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
                <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
                <div className="space-y-4">
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold">What is your return policy?</h2>
                        <p className="text-muted-foreground">Our return policy allows for returns within 30 days of purchase.</p>
                    </div>
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold">How do I track my order?</h2>
                        <p className="text-muted-foreground">You can track your order using the tracking link sent to your email.</p>
                    </div>
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold">Do you offer international shipping?</h2>
                        <p className="text-muted-foreground">Yes, we offer international shipping to select countries.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}


export default FaqPage;