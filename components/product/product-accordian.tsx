// src/components/product/ProductAccordion.tsx
"use client";

import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductAccordionProps {
    description: string;
    washCare: string;
}

export default function ProductAccordion({ description, washCare }: ProductAccordionProps) {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description" className="border-border">
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    Description
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="wash-care" className="border-border">
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    Wash & Care
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {washCare}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}