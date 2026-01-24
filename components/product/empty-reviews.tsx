import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function EmptyReviews() {
    return (
        <Card className="border-2 border-dashed">
            <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground text-sm">
                    Be the first to review this product!
                </p>
            </CardContent>
        </Card>
    );
}
