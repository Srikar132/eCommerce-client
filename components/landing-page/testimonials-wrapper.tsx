import { getActiveTestimonials } from "@/lib/actions/content-actions";
import TestimonialsClient from "./testimonials";

export default async function Testimonials() {

    try {
        const testimonials = await getActiveTestimonials();
    
        return <TestimonialsClient testimonials={testimonials} />
    } catch (error) {
        return null;
    }
}
