import { FolderTree, LayoutDashboard, Package, Settings, ShoppingCart, Star, Users } from "lucide-react";

export const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Products",
    icon: Package,
    href: "/admin/products",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/admin/orders",
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];