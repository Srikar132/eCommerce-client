import { getActiveTestimonials } from "@/lib/actions/content-actions";
import TestimonialsClient from "./testimonials";

export default async function Testimonials() {
    // Handle data fetching outside of render logic to avoid try/catch JSX violation
    const testimonials = await getActiveTestimonials().catch((error) => {
        console.error("Failed to fetch testimonials:", error);
        return [];
    });

    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <>
            <TestimonialsClient
                testimonials={testimonials}
            />
        </>
    );
}
