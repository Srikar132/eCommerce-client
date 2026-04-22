import { MessageSquare } from "lucide-react";

export function EmptyReviews() {
    return (
        <div className="py-24 text-center border-2 border-dashed border-foreground/5 rounded-[32px] bg-foreground/[0.02]">
            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-8 w-8 text-foreground/40" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black tracking-tight text-foreground uppercase mb-3">No reviews yet</h3>
            <p className="text-muted-foreground text-base max-w-xs mx-auto">
                Be the first to share your experience with this premium handcrafted piece.
            </p>
        </div>
    );
}
