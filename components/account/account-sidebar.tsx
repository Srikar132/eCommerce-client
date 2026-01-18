import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  User, 
  Shield, 
  CreditCard, 
  MessageSquare,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import LogoutButton from '../auth/logout-button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/account' },
  { icon: ShoppingBag, label: 'Orders', href: '/account/orders' },
  { icon: Heart, label: 'Wishlist', href: '/account/wishlist' },
  { icon: MapPin, label: 'Saved Addresses', href: '/account/saved-addresses' },
  { icon: User, label: 'Account Details', href: '/account/account-details' },
  { icon: Shield, label: 'Security', href: '/account/security' },
  { icon: CreditCard, label: 'Payments', href: '/account/payments' },
  { icon: MessageSquare, label: 'Contact Us', href: '/contact' },
];

const Sidebar = ({ currentPath = '/account' }) => {
  return (
    <div className="w-full bg-card rounded-lg border overflow-hidden">
      {/* Navigation Menu */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          
          return (
            <Button
              key={item.label}
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3 text-sm font-light",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon size={18} className="shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight size={16} className="shrink-0" />}
              </Link>
            </Button>
          );
        })}
      </nav>

      <Separator className="my-2" />

      {/* Logout Button */}
      <LogoutButton/>
    </div>
  );
};

export default Sidebar;