"use client";

import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook, Mail, Link as LinkIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductShareProps {
    productName: string;
    productSlug: string;
}

export default function ProductShare({ productName, productSlug }: ProductShareProps) {
    const [copied, setCopied] = useState(false);
    
    // Construct the absolute URL (handling both SSR and CSR)
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${baseUrl}/products/${productSlug}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const socialPlatforms = [
        {
            name: "WhatsApp",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
            ),
            href: `https://wa.me/?text=Check out this premium piece from Nala Armoire: ${productName} ${shareUrl}`,
            color: "hover:bg-[#25D366] hover:text-white",
        },
        {
            name: "X (Twitter)",
            icon: <Twitter className="w-5 h-5" />,
            href: `https://twitter.com/intent/tweet?text=Discover this handcrafted masterpiece from @NalaArmoire: ${productName}&url=${shareUrl}`,
            color: "hover:bg-black hover:text-white",
        },
        {
            name: "Facebook",
            icon: <Facebook className="w-5 h-5" />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
            color: "hover:bg-[#1877F2] hover:text-white",
        },
        {
            name: "Email",
            icon: <Mail className="w-5 h-5" />,
            href: `mailto:?subject=Look what I found at Nala Armoire: ${productName}&body=I thought you might love this handcrafted piece: ${shareUrl}`,
            color: "hover:bg-accent hover:text-white",
        },
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 group"
                    title="Share this product"
                >
                    <Share2 className="w-4 h-4 text-foreground/60 group-hover:text-foreground transition-colors" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[28px] border-none shadow-2xl p-8">
                <DialogHeader className="space-y-2 mb-6">
                    <DialogTitle className="text-2xl font-black tracking-tight">Share this piece</DialogTitle>
                    <p className="text-muted-foreground text-sm">
                        Share the beauty of {productName} with your world.
                    </p>
                </DialogHeader>

                <div className="space-y-8">
                    {/* Copy Link Section */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                            Copy Link
                        </label>
                        <div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border/50">
                            <div className="p-2 text-muted-foreground/40">
                                <LinkIcon size={16} />
                            </div>
                            <Input
                                readOnly
                                value={shareUrl}
                                className="border-none bg-transparent focus-visible:ring-0 text-xs font-medium text-foreground/70 truncate px-0"
                            />
                            <Button
                                size="sm"
                                onClick={handleCopy}
                                className={cn(
                                    "rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300",
                                    copied ? "bg-[#5FB281] text-white" : "bg-foreground text-background hover:opacity-90"
                                )}
                            >
                                {copied ? (
                                    <span className="flex items-center gap-1.5">
                                        <Check size={12} strokeWidth={3} /> Copied
                                    </span>
                                ) : (
                                    "Copy"
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Social Share Section */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                            Share on Social
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {socialPlatforms.map((platform) => (
                                <a
                                    key={platform.name}
                                    href={platform.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "flex flex-col items-center justify-center p-4 rounded-[20px] bg-muted/30 transition-all duration-300 group",
                                        platform.color
                                    )}
                                >
                                    <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
                                        {platform.icon}
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                                        {platform.name}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
