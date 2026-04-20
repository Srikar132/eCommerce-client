import { 
  LayoutDashboard, 
  ShoppingBag, 
  ReceiptText, 
  UsersRound, 
  MonitorPlay, 
  Settings2 
} from "lucide-react";

export const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Products",
    icon: ShoppingBag,
    href: "/admin/products",
  },
  {
    label: "Orders",
    icon: ReceiptText,
    href: "/admin/orders",
  },
  {
    label: "Users",
    icon: UsersRound,
    href: "/admin/users",
  },
  {
    label: "Landing Page",
    icon: MonitorPlay,
    href: "/admin/content"
  },
  {
    label: "Settings",
    icon: Settings2,
    href: "/admin/settings",
  },
];