"use server";

import { otpHelpers, OTP_CONFIG } from "@/lib/upstash";
import { sendOtpSms, formatPhoneNumber, validatePhoneNumber } from "@/lib/twilio";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

// ==================== SEND OTP ====================

export async function sendOtp(phone: string) {
  try {
    if (!phone) {
      return {
        success: false,
        error: "Phone number is required",
      };
    }

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(phone);

    if (!validatePhoneNumber(formattedPhone)) {
      return {
        success: false,
        error: "Invalid phone number format. Please use a valid Indian mobile number.",
      };
    }

    // Check rate limit
    const isRateLimited = await otpHelpers.checkRateLimit(formattedPhone);
    if (isRateLimited) {
      return {
        success: false,
        error: "Please wait 60 seconds before requesting a new OTP",
        rateLimited: true,
      };
    }

    // Generate OTP
    const otp = otpHelpers.generateOtp();

    // Store OTP in Upstash Redis
    await otpHelpers.storeOtp(formattedPhone, otp);

    // Set rate limit
    await otpHelpers.setRateLimit(formattedPhone);

    // Reset attempts counter
    await otpHelpers.resetAttempts(formattedPhone);

    // Send OTP via SMS
    const smsSent = await sendOtpSms(formattedPhone, otp);

    if (!smsSent) {
      // Clean up if SMS failed
      await otpHelpers.deleteOtp(formattedPhone);
      return {
        success: false,
        error: "Failed to send OTP. Please try again.",
      };
    }

    // For development: Log OTP (remove in production!)
    if (process.env.NODE_ENV === "development") {
      console.log(`🔐 OTP for ${formattedPhone}: ${otp}`);
    }

    return {
      success: true,
      message: "OTP sent successfully",
      expiresIn: 300, // 5 minutes
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}

// ==================== VERIFY OTP ====================

export async function verifyOtp(phone: string, otp: string) {
  try {
    if (!phone || !otp) {
      return {
        success: false,
        error: "Phone number and OTP are required",
      };
    }

    const formattedPhone = formatPhoneNumber(phone);

    // Check attempts
    const attempts = await otpHelpers.getAttempts(formattedPhone);
    if (attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
      return {
        success: false,
        error: "Maximum verification attempts exceeded. Please request a new OTP.",
        maxAttemptsExceeded: true,
      };
    }

    // Get stored OTP
    const storedOtp = await otpHelpers.getOtp(formattedPhone);

    if (!storedOtp) {
      return {
        success: false,
        error: "OTP expired or not found. Please request a new OTP.",
      };
    }

    // Convert both to strings and trim for comparison
    const storedOtpString = String(storedOtp).trim();
    const receivedOtpString = String(otp).trim();



    // Verify OTP
    if (storedOtpString !== receivedOtpString) {
      // Increment attempts
      const newAttempts = await otpHelpers.incrementAttempts(formattedPhone);
      const remainingAttempts = OTP_CONFIG.MAX_ATTEMPTS - newAttempts;

      return {
        success: false,
        error: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
        remainingAttempts,
      };
    }

    // OTP is valid - clean up
    await otpHelpers.deleteOtp(formattedPhone);
    await otpHelpers.resetAttempts(formattedPhone);

    return {
      success: true,
      message: "OTP verified successfully",
      phone: formattedPhone,
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}

// ==================== LOGIN WITH OTP ====================

export async function loginWithOtp(phone: string, otp: string) {
  try {
    if (!phone || !otp) {
      return {
        success: false,
        error: "Phone number and OTP are required",
      };
    }

    const formattedPhone = formatPhoneNumber(phone);

    // First verify the OTP
    const verifyResult = await verifyOtp(formattedPhone, otp);

    if (!verifyResult.success) {
      return verifyResult;
    }

    // OTP verified - now sign in with NextAuth
    try {
      await signIn("phone-otp", {
        phone: formattedPhone,
        otp,
        redirect: false,
      });

      // Fetch the user to get their role for client-side redirect
      const [user] = await db
        .select({ id: users.id, role: users.role, phone: users.phone })
        .from(users)
        .where(eq(users.phone, formattedPhone))
        .limit(1);

      console.log("🔐 [LOGIN] User fetched for redirect:", {
        phone: formattedPhone,
        userId: user?.id,
        role: user?.role,
      });

      // revalidate the CART & WISHLIST PAGES
      revalidatePath("/cart");
      revalidatePath("/wishlist");

      return {
        success: true,
        message: "Login successful",
        user: user ? { id: user.id, role: user.role, phone: user.phone } : undefined,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        return {
          success: false,
          error: error.message || "Authentication failed",
        };
      }
      throw error;
    }
  } catch (error) {
    console.error("Error logging in with OTP:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}

// ==================== LOGOUT ====================

export async function logout() {
  try {
    await signOut({ redirect: false });
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Error logging out:", error);
    return {
      success: false,
      error: "Failed to logout",
    };
  }
}