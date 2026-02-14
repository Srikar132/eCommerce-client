import { getActiveTestimonials } from "@/lib/actions/content-actions";
import TestimonialsClient from "./testimonials";

export default async function Testimonials() {
    const testimonials = await getActiveTestimonials();

    return <TestimonialsClient testimonials={testimonials} />;
}
