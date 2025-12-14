"use client";


import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const { logout , isLoading } = useAuth();

  return (
    <Button
      variant="outline"
      className="w-full h-12 border-zinc-300 rounded-none hover:bg-zinc-100 hover:border-zinc-400 max-w-sm"
      onClick={logout}
      disabled={isLoading}
    >
      <LogOut size={18} className="mr-3" />
      <span className="font-medium tracking-widest">
        {isLoading ? 'Signing Out...' : 'Sign Out'}
      </span>
    </Button>
  );
};