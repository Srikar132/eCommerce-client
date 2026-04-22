import { resendSendEmail } from "./resend";
import { checkEmailRateLimit } from "@/lib/upstash";

// ==================== TYPES ====================

export interface SendEmailOptions {
    /** Recipient email(s) */
    to: string | string[];
    /** Email subject line */
    subject: string;
    /** HTML body content */
    html: string;
    /** Rate-limit identifier (defaults to first recipient) */
    rateLimitKey?: string;
    /** Reply-to address */
    replyTo?: string;
    /** Optional tags for analytics in Resend dashboard */
    tags?: Array<{ name: string; value: string }>;
    /** Skip rate limiting (e.g., for transactional order emails) */
    skipRateLimit?: boolean;
}

export interface SendEmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
    rateLimited?: boolean;
}

// ==================== SEND EMAIL ====================

/**
 * Send an email via Resend with optional Upstash rate limiting.
 *
 * - Transactional emails (order confirmations) should set `skipRateLimit: true`
 * - Marketing / notification emails are rate-limited per recipient
 * - Automatically retries on 5xx / network failures (handled in resend client)
 * - Never throws — always returns a result object
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    const { to, subject, html, rateLimitKey, replyTo, tags, skipRateLimit } = options;

    const recipients = Array.isArray(to) ? to : [to];
    const identifier = rateLimitKey || recipients[0];

    // Rate limit check (skip for critical transactional emails)
    if (!skipRateLimit) {
        try {
            const rateLimit = await checkEmailRateLimit(identifier);
            if (!rateLimit.success) {
                console.warn(
                    `📧 [RATE LIMITED] ${identifier} — remaining: ${rateLimit.remaining}, resets: ${new Date(rateLimit.reset).toISOString()}`
                );
                return { success: false, error: "Rate limit exceeded. Try again later.", rateLimited: true };
            }
        } catch (rateLimitError) {
            // If rate limiter is down, allow the email through (fail-open)
            console.error("📧 [RATE LIMIT ERROR] Falling through:", rateLimitError);
        }
    }

    // Send via Resend
    const { data, error } = await resendSendEmail({
        to: recipients,
        subject,
        html,
        ...(replyTo && { reply_to: replyTo }),
        ...(tags && { tags }),
    });

    if (error) {
        console.error(`📧 [SEND FAILED] to=${recipients.join(",")} error=${error.message}`);
        return { success: false, error: error.message };
    }

    console.log(`📧 [SENT] to=${recipients.join(",")} id=${data?.id}`);
    return { success: true, messageId: data?.id };
}
