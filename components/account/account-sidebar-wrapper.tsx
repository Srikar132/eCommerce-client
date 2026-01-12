"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./account-sidebar";

export default function AccountSidebarWrapper() {
  const pathname = usePathname();
  
  return <Sidebar currentPath={pathname} />;
}
