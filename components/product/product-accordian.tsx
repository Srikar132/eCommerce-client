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
        <Accordion type="single" collapsible className="pdp-accordion">
            <AccordionItem value="description" className="pdp-accordion-item">
                <AccordionTrigger className="pdp-accordion-trigger">
                    DESCRIPTION
                </AccordionTrigger>
                <AccordionContent className="pdp-accordion-content">
                    {description}
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="wash-care" className="pdp-accordion-item">
                <AccordionTrigger className="pdp-accordion-trigger">
                    WASH & CARE
                </AccordionTrigger>
                <AccordionContent className="pdp-accordion-content">
                    {washCare}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}