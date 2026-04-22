"use client";

import React from "react";
import { X, Ruler, Info } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MEASUREMENT_DESCRIPTIONS } from "@/constants";

interface SizeGuideModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
    open,
    onOpenChange,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="max-w-2xl h-[80vh] p-0 overflow-hidden border-none bg-background rounded-[40px] shadow-2xl flex flex-col"
            >
                {/* Header Section */}
                <div className="px-8 pt-8 pb-6 bg-accent/5 border-b border-border/10 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-background border border-border/10 shadow-sm">
                                <Ruler className="w-5 h-5 text-accent" />
                            </div>
                            <div className="space-y-0.5">
                                <DialogTitle className="text-xl font-bold tracking-tighter uppercase">
                                    Size <span className="italic font-serif font-light">Guide</span>
                                </DialogTitle>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                                    Crafted for the perfect fit
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 hover:bg-background rounded-full transition-all duration-300 border border-transparent hover:border-border/20 group"
                            aria-label="Close"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="px-8 py-6 space-y-10 pb-10">
                            {/* Size Matrix */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="h-px w-6 bg-accent/20" />
                                    <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
                                        International Sizing
                                    </h3>
                                </div>

                                <div className="rounded-3xl border border-border/10 bg-accent/5 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-background/50">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="w-[100px] text-[10px] font-bold uppercase tracking-widest pl-6">Metric</TableHead>
                                                <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest">36</TableHead>
                                                <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest">38</TableHead>
                                                <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest">40</TableHead>
                                                <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest">42</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[
                                                { label: "Waist", values: ["36", "38.5", "41", "43.5"] },
                                                { label: "Hips", values: ["62", "64.5", "67", "69.5"] },
                                                { label: "Inseam", values: ["76", "77", "78", "79"] },
                                                { label: "Outseam", values: ["102", "104", "106", "108"] },
                                            ].map((row, idx) => (
                                                <TableRow key={idx} className="hover:bg-background/40 border-border/5 transition-colors">
                                                    <TableCell className="font-bold text-[10px] uppercase tracking-wider pl-6 text-foreground/70">
                                                        {row.label}
                                                    </TableCell>
                                                    {row.values.map((val, vIdx) => (
                                                        <TableCell key={vIdx} className="text-center text-xs font-medium tabular-nums text-muted-foreground">
                                                            {val}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic px-2">
                                    * All measurements are in centimeters (cm)
                                </p>
                            </section>

                            {/* Measurement Instructions */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <span className="h-px w-6 bg-accent/20" />
                                    <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
                                        How to Measure
                                    </h3>
                                </div>

                                <div className="grid gap-4">
                                    {MEASUREMENT_DESCRIPTIONS.map((measurement, index) => (
                                        <div
                                            key={index}
                                            className="group p-5 rounded-[2rem] bg-accent/5 border border-transparent hover:border-border/10 transition-all duration-300"
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 shrink-0 rounded-full bg-background flex items-center justify-center text-[10px] font-bold border border-border/10 shadow-sm group-hover:bg-accent group-hover:text-white transition-colors">
                                                    0{index + 1}
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                                                        {measurement.label}
                                                    </h4>
                                                    <p className="text-[13px] leading-relaxed text-muted-foreground tracking-tight">
                                                        {measurement.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Need Help Footer */}
                            <div className="p-6 rounded-[2.5rem] bg-foreground text-background flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold uppercase tracking-wider">Unsure about your size?</p>
                                        <p className="text-[10px] opacity-60">Our concierge is available to assist you with a personalized fit.</p>
                                    </div>
                                </div>
                                <button className="px-6 py-2.5 bg-background text-foreground rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                                    Chat Now
                                </button>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};