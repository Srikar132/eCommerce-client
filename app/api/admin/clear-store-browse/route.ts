import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * POST /api/admin/clear-store-browse
 * Clears the admin store browse cookie and redirects to admin dashboard
 * Only accessible by authenticated admin users
 */
export async function POST() {
    try {
        const session = await auth();

        // Security check - only admins can clear this cookie
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const response = NextResponse.json({ success: true });

        // Clear the browse cookie
        response.cookies.delete('admin_store_browse');

        return response;
    } catch (error) {
        console.error('Error clearing admin store browse cookie:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
