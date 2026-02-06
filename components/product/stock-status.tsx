import { Badge } from "@/components/ui/badge";
import { getStockStatusMessage } from "@/lib/utils/variant-utils";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface StockStatusProps {
    stockQuantity: number;
    showIcon?: boolean;
    className?: string;
}

export default function StockStatus({ 
    stockQuantity, 
    showIcon = true,
    className = "" 
}: StockStatusProps) {
    const { message, type } = getStockStatusMessage(stockQuantity);

    const getVariant = () => {
        switch (type) {
            case 'out-of-stock':
                return 'destructive';
            case 'low-stock':
                return 'destructive';
            case 'in-stock':
                return 'default';
            default:
                return 'secondary';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'out-of-stock':
                return <XCircle className="w-3 h-3" />;
            case 'low-stock':
                return <AlertCircle className="w-3 h-3" />;
            case 'in-stock':
                return <CheckCircle className="w-3 h-3" />;
            default:
                return null;
        }
    };

    return (
        <Badge 
            variant={getVariant()} 
            className={`text-xs ${className}`}
        >
            {showIcon && (
                <span className="mr-1">
                    {getIcon()}
                </span>
            )}
            {message}
        </Badge>
    );
}