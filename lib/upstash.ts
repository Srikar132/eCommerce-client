import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Missing Upstash Redis environment variables");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// OTP Configuration
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_SECONDS: 300, // 5 minutes
  MAX_ATTEMPTS: 5,
  RATE_LIMIT_SECONDS: 60, // 1 minute between OTP requests
};

// Helper functions for OTP management
export const otpHelpers = {
  // Generate OTP key for Redis
  getOtpKey: (phone: string) => `otp:${phone}`,
  getAttemptsKey: (phone: string) => `otp:attempts:${phone}`,
  getRateLimitKey: (phone: string) => `otp:ratelimit:${phone}`,

  // Generate 6-digit OTP
  generateOtp: (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Store OTP in Redis
  storeOtp: async (phone: string, otp: string): Promise<void> => {
    const key = otpHelpers.getOtpKey(phone);
    await redis.setex(key, OTP_CONFIG.EXPIRY_SECONDS, otp);
  },

  // Get OTP from Redis
  getOtp: async (phone: string): Promise<string | null> => {
    const key = otpHelpers.getOtpKey(phone);
    const value = await redis.get(key);
    // Ensure we always return a string or null
    return value ? String(value) : null;
  },

  // Delete OTP from Redis
  deleteOtp: async (phone: string): Promise<void> => {
    const key = otpHelpers.getOtpKey(phone);
    await redis.del(key);
  },

  // Check rate limit
  checkRateLimit: async (phone: string): Promise<boolean> => {
    const key = otpHelpers.getRateLimitKey(phone);
    const exists = await redis.exists(key);
    return exists === 1;
  },

  // Set rate limit
  setRateLimit: async (phone: string): Promise<void> => {
    const key = otpHelpers.getRateLimitKey(phone);
    await redis.setex(key, OTP_CONFIG.RATE_LIMIT_SECONDS, "1");
  },

  // Get verification attempts
  getAttempts: async (phone: string): Promise<number> => {
    const key = otpHelpers.getAttemptsKey(phone);
    const attempts = await redis.get<number>(key);
    return attempts || 0;
  },

  // Increment verification attempts
  incrementAttempts: async (phone: string): Promise<number> => {
    const key = otpHelpers.getAttemptsKey(phone);
    const attempts = await redis.incr(key);
    
    // Set expiry same as OTP
    if (attempts === 1) {
      await redis.expire(key, OTP_CONFIG.EXPIRY_SECONDS);
    }
    
    return attempts;
  },

  // Reset attempts
  resetAttempts: async (phone: string): Promise<void> => {
    const key = otpHelpers.getAttemptsKey(phone);
    await redis.del(key);
  },
};
