import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {authApi} from '@/lib/api/auth';

/**
 * Send OTP API Route
 * POST /api/auth/send-otp
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const schema = z.object({
      phone: z.string().min(10, 'Phone number is required'),
    });

    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid phone number',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { phone } = validation.data;

    // Call backend to send OTP
    const response = await authApi.sendOtp({ phone });

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Send OTP error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP',
      },
      { status: error.response?.status || 500 }
    );
  }
}