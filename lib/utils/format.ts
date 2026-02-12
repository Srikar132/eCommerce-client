/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: USD)
 * @param locale The locale (default: en-US)
 */
export function formatCurrency(
    amount: number,
    currency = "USD",
    locale = "en-US"
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @param options Intl.DateTimeFormatOptions
 */
export function formatDate(
    dateString: string,
    options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    }
): string {
    return new Date(dateString).toLocaleDateString("en-US", options);
}

/**
 * Format a date string to include time
 * @param dateString ISO date string
 */
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })}`;
}

/**
 * Truncate text to a specified length
 * @param text The text to truncate
 * @param length The maximum length
 * @param suffix The suffix to add (default: "...")
 */
export function truncateText(
    text: string,
    length: number,
    suffix = "..."
): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + suffix;
}

/**
 * Format a number with padding (e.g., for product IDs, order numbers)
 * @param num The number to format
 * @param length The desired length
 * @param char The character to pad with (default: "0")
 */
export function formatPaddedNumber(
    num: number,
    length = 2,
    char = "0"
): string {
    return String(num).padStart(length, char);
}