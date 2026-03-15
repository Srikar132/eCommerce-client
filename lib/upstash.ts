import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Missing Upstash Redis environment variables");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ==================== EMAIL RATE LIMITING ====================

/**
 * Rate limiter for email sending — prevents spam/abuse.
 * Allows 5 emails per 1 hour window per identifier (userId or IP).
 */
export const emailRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:email",
});

/**
 * Stricter rate limiter for sensitive emails (e.g., OTP, password reset).
 * Allows 3 requests per 10 minutes per identifier.
 */
export const sensitiveEmailRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "10 m"),
  analytics: true,
  prefix: "ratelimit:email:sensitive",
});

/**
 * General API rate limiter.
 * Allows 20 requests per 10 seconds per identifier.
 */
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
  analytics: true,
  prefix: "ratelimit:api",
});

// ==================== RATE LIMIT HELPERS ====================

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check email rate limit for a given identifier (userId, email, or IP).
 * Returns whether the request is allowed and remaining quota.
 */
export async function checkEmailRateLimit(identifier: string): Promise<RateLimitResult> {
  const result = await emailRateLimiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Check sensitive email rate limit for a given identifier.
 */
export async function checkSensitiveEmailRateLimit(identifier: string): Promise<RateLimitResult> {
  const result = await sensitiveEmailRateLimiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
