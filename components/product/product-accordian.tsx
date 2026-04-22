
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { Sparkles, Droplets, Box } from "lucide-react";

interface ProductAccordionProps {
    description?: string;
    washCare?: string;
    material?: string;
}

export default function ProductAccordion({ description, washCare, material }: ProductAccordionProps) {
    const items = [
        {
            id: "features",
            label: "Specific Features",
            icon: Sparkles,
            content: description || "Detailed craftsmanship and unique design elements tailored for premium comfort."
        },
        {
            id: "care",
            label: "Care & Cleaning",
            icon: Droplets,
            content: washCare || "Hand wash cold, line dry. Do not bleach. Professional dry clean recommended for best results."
        },
        {
            id: "materials",
            label: "Materials",
            icon: Box,
            content: material || "Premium quality fabric sourced ethically to ensure durability and a luxury feel."
        }
    ];

    return (
        <Accordion type="single" collapsible className="w-full">
            {items.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-b border-foreground/5 py-2">
                    <AccordionTrigger className="hover:no-underline group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                                <item.icon size={18} className="text-foreground" strokeWidth={1.5} />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-foreground">{item.label}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 pl-14 text-muted-foreground leading-relaxed text-base">
                        {item.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}