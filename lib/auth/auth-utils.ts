import { User, UserRole } from '@/types';

/**
 * Authentication Utility Functions
 * 
 * Provides helper functions for user role checks,
 * account status validation, and display utilities
 */

// ==================== Role Checks ====================

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role;
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  return user ? roles.includes(user.role) : false;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'ADMIN');
}

/**
 * Check if user is customer
 */
export function isCustomer(user: User | null): boolean {
  return hasRole(user, 'CUSTOMER');
}

// ==================== Account Status ====================

/**
 * Check if user account is active
 */
export function isAccountActive(user: User | null): boolean {
  return user?.isActive ?? false;
}

/**
 * Check if user phone is verified
 */
export function isPhoneVerified(user: User | null): boolean {
  return user?.phoneVerified ?? false;
}

/**
 * Check if user email is verified
 */
export function isEmailVerified(user: User | null): boolean {
  return user?.emailVerified ?? false;
}

/**
 * Check if user account is locked
 */
export function isAccountLocked(user: User | null): boolean {
  if (!user?.lockedUntil) return false;
  return new Date(user.lockedUntil) > new Date();
}

/**
 * Get remaining lock time in minutes
 */
export function getLockTimeRemaining(user: User | null): number {
  if (!user?.lockedUntil) return 0;
  const lockUntil = new Date(user.lockedUntil);
  const now = new Date();
  const diff = lockUntil.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 60000));
}

// ==================== Display Utilities ====================

/**
 * Get user display name
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  return user.username || user.email || `${user.countryCode}${user.phone}`;
}

/**
 * Format phone number for display
 */
export function formatPhone(countryCode: string, phone: string): string {
  return `${countryCode} ${phone}`;
}

/**
 * Mask phone number (show last 4 digits only)
 */
export function maskPhone(phone: string): string {
  if (phone.length < 4) return '****';
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user: User | null): string {
  if (!user) return 'G';
  
  if (user.username) {
    const parts = user.username.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  }
  
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }
  
  return 'U';
}

// ==================== Validation ====================

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate OTP format
 */
export function isValidOtp(otp: string): boolean {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
}
