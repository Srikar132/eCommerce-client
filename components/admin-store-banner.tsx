'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminStoreBannerProps {
    userRole?: string;
}

/**
 * Banner shown to admin users when browsing the store
 * Provides easy return to admin dashboard
 */
export function AdminStoreBanner({ userRole }: AdminStoreBannerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show for admin users on non-admin pages
        if (userRole === 'ADMIN') {
            // Small delay to prevent flash on admin routes
            const timer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(timer);
        }
    }, [userRole]);

    const handleReturnToAdmin = async () => {
        startTransition(async () => {
            try {
                // Call API to clear the browse cookie
                const response = await fetch('/api/admin/clear-store-browse', {
                    method: 'POST',
                    credentials: 'include',
                });

                if (response.ok) {
                    // Redirect to admin dashboard
                    router.push('/admin');
                    router.refresh();
                }
            } catch (error) {
                console.error('Error returning to admin:', error);
                // Fallback - just navigate (cookie will be cleared by proxy)
                router.push('/admin');
            }
        });
    };

    if (!isVisible || userRole !== 'ADMIN') {
        return null;
    }

    return (
        <div className="sticky top-0 z-[100] bg-rose-400 text-amber-950 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-2.5 gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                        <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                            You are viewing the store as Admin
                        </span>
                    </div>

                    <Button
                        onClick={handleReturnToAdmin}
                        disabled={isPending}
                        size="sm"
                        variant="secondary"
                        className="flex-shrink-0 bg-amber-950 text-amber-100 hover:bg-amber-900 border-0"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1.5" />
                        <span className="hidden sm:inline">Return to Admin Dashboard</span>
                        <span className="sm:hidden">Admin</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
