"use client";

import { useState } from 'react';
import { Button } from '../ui/button';
import { logout } from '@/lib/actions/auth-actions';
import { LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const result = await logout();
      if (result.success) {
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
    <Button
      variant="outline"
      className="w-full h-12 border-2 border-primary/20 rounded-2xl hover:bg-primary/5 hover:border-primary/30 hover:scale-[1.02] transition-all duration-200 max-w-sm shadow-md hover:shadow-lg"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 size={18} className="mr-3 animate-spin text-primary" />
      ) : (
        <LogOut size={18} className="mr-3 text-primary" />
      )}
      <span className="font-medium">
        {isLoading ? 'Signing Out...' : 'Sign Out'}
      </span>
    </Button>
  );
};