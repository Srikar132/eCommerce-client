import Image from "next/image";
import { RefreshCcw } from "lucide-react";

interface ErrorCardProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export default function ErrorCard({ 
    title = "Something went wrong", 
    message = "We couldn't fetch the data. Please try again.", 
    onRetry 
}: ErrorCardProps) {
    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-16">
            {/* Error Robot Image */}
            <div className="flex justify-center mb-8">
                <div className="relative w-54 h-54">
                    <Image
                        src="/images/error-robot.png"
                        alt="Error"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Error Message */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {title}
                </h2>
                <p className="text-gray-600 text-base max-w-md mx-auto">
                    {message}
                </p>
            </div>

            {/* Retry Button */}
            {onRetry && (
                <div className="text-center">
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}