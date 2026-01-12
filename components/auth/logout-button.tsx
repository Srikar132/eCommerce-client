"use client";


import { Button } from '../ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, Loader2 } from 'lucide-react';

export default function LogoutButton() {
  const { logout , isLoading } = useAuth();

  return (
    <Button
      variant="outline"
      className="w-full h-12 border-2 border-primary/20 rounded-2xl hover:bg-primary/5 hover:border-primary/30 hover:scale-[1.02] transition-all duration-200 max-w-sm shadow-md hover:shadow-lg"
      onClick={logout}
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