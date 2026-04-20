import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";

interface ErrorCardProps {
    title?: string;
    message?: string | ReactNode;
    onRetry?: () => void;
}

export default function ErrorCard({
    title = "Something went wrong!",
    message = "There was a problem processing your request.",
    onRetry
}: ErrorCardProps) {
    return (
        <div className="w-full max-w-md mx-auto px-4 py-8">
            <div className="relative bg-destructive/5 border border-destructive/20 rounded-3xl shadow-lg p-8 md:p-12">

                {/* Error Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center shadow-sm">
                        <AlertCircle className="w-8 h-8 text-destructive" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-center text-muted-foreground text-sm md:text-base mb-8 leading-relaxed">
                    {message}
                </p>

                {/* Sad Cloud Illustration */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-48 h-32">
                        <Image
                            src="/images/error-cloud.webp"
                            alt="Sad cloud"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Retry Button */}
                {onRetry && (
                    <div className="text-center">
                        <Button
                            onClick={onRetry}
                            variant="destructive"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-destructive/30 rounded-full animate-pulse" />
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-destructive/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
        </div>
    );
}