"use client";

import { useState } from 'react';
import CustomButton from '../ui/custom-button';
import { logout } from '@/lib/actions/auth-actions';
import { LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/tanstack/query-keys';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const result = await logout();
      if (result.success) {
        // Clear all user-specific TanStack Query caches
        queryClient.removeQueries({ queryKey: queryKeys.cart.all() });
        queryClient.removeQueries({ queryKey: queryKeys.wishlist.all() });
        queryClient.removeQueries({ queryKey: queryKeys.user.all() });
        queryClient.removeQueries({ queryKey: queryKeys.account.all() });
        queryClient.removeQueries({ queryKey: queryKeys.addresses.all() });

        toast.success('Logged out successfully');
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="w-full">
          <CustomButton
            onClick={() => { }}
            circleSize={32}
            circleColor="#ef4444"
            textColor="#111111"
            textHoverColor="#ffffff"
            className="w-full shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Out...' : 'Sign Out'}
          </CustomButton>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2rem] p-8 md:p-10 border-none shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="h3 !text-2xl">Sign Out</AlertDialogTitle>
          <AlertDialogDescription className="p-base text-muted-foreground pt-2">
            Are you sure you want to sign out? You will be redirected to the login page and your current session will end.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-6 gap-3">
          <AlertDialogCancel
            disabled={isLoading}
            className="rounded-full px-8 py-6 h-auto font-bold border-muted-foreground/20 hover:bg-muted transition-all"
          >
            Stay Logged In
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            className="rounded-full px-8 py-6 h-auto font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut size={18} />
                Confirm Sign Out
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};