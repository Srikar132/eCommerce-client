/**
 * Email Module — Public API
 *
 * Usage:
 *   import { sendEmail, welcomeEmail, orderConfirmationEmail } from "@/lib/emails";
 *
 * All email sends are non-blocking and never throw.
 * Transactional emails (orders) skip rate limiting.
 */

// Core sender
export { sendEmail } from "./send-email";
export type { SendEmailOptions, SendEmailResult } from "./send-email";

// Resend config
export { EMAIL_FROM } from "./resend";

// Templates
export {
    welcomeEmail,
    notificationEmail,
    orderConfirmationEmail,
    orderDeliveredEmail,
    orderShippedEmail,
} from "./templates";
export type {
    WelcomeEmailProps,
    NotificationEmailProps,
    OrderConfirmationEmailProps,
    OrderDeliveredEmailProps,
    OrderShippedEmailProps,
} from "./templates";
