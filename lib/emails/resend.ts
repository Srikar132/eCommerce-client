import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
    console.warn("⚠️  Missing RESEND_API_KEY — email sending will be disabled.");
}

export const EMAIL_FROM = "Nala Armoire <noreply@nalaarmoire.com>";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function resendSendEmail(payload: {
    to: string[];
    subject: string;
    html: string;
    reply_to?: string;
    tags?: Array<{ name: string; value: string }>;
}) {
    if (!resend) {
        return {
            data: null,
            error: { statusCode: 500, message: "RESEND_API_KEY not configured", name: "ConfigError" },
        };
    }

    const { data, error } = await resend.emails.send({
        from: EMAIL_FROM,
        ...payload,
    });

    if (error) {
        return { data: null, error: { statusCode: 500, message: error.message, name: error.name } };
    }

    return { data, error: null };
}