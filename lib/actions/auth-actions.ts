"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

// ==================== LOGIN WITH GOOGLE ====================

export async function loginWithGoogle() {
  try {
    await signIn("google", { redirectTo: "/account" });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: error.message || "Authentication failed",
      };
    }
    throw error;
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