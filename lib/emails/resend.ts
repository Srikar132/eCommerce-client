/**
 * Resend Email Client Configuration
 *
 * Uses direct HTTP fetch to Resend API for maximum compatibility
 * across Next.js server components, server actions, and API routes.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
    console.warn("⚠️  Missing RESEND_API_KEY — email sending will be disabled.");
}

/** Default sender — must match a verified domain in Resend. */
export const EMAIL_FROM = process.env.EMAIL_FROM || "Nala Armoire <noreply@nalaarmoire.com>";

// ==================== TYPES ====================

export interface ResendEmailPayload {
    from: string;
    to: string[];
    subject: string;
    html: string;
    reply_to?: string;
    tags?: Array<{ name: string; value: string }>;
}

export interface ResendSuccessResponse {
    id: string;
}

export interface ResendErrorResponse {
    statusCode: number;
    message: string;
    name: string;
}

// ==================== RESEND API CLIENT ====================

const RESEND_API_URL = "https://api.resend.com/emails";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

/**
 * Send an email via Resend's REST API with automatic retry.
 * Uses native `fetch` directly — avoids SDK compatibility issues with Next.js.
 */
export async function resendSendEmail(
    payload: ResendEmailPayload
): Promise<{ data: ResendSuccessResponse | null; error: ResendErrorResponse | null }> {
    if (!RESEND_API_KEY) {
        return {
            data: null,
            error: { statusCode: 500, message: "RESEND_API_KEY not configured", name: "ConfigError" },
        };
    }

    let lastError: ResendErrorResponse | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(RESEND_API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const body = await response.json();

            if (response.ok) {
                return { data: body as ResendSuccessResponse, error: null };
            }

            lastError = body as ResendErrorResponse;

            // Don't retry on 4xx client errors (bad request, unauthorized, etc.)
            if (response.status >= 400 && response.status < 500) {
                return { data: null, error: lastError };
            }

            // 5xx — retry after delay
            if (attempt < MAX_RETRIES) {
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
            }
        } catch (fetchError) {
            lastError = {
                statusCode: 0,
                message: fetchError instanceof Error ? fetchError.message : "Network error",
                name: "FetchError",
            };

            if (attempt < MAX_RETRIES) {
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
            }
        }
    }

    return { data: null, error: lastError };
}
