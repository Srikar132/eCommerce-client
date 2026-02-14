"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { LogIn, ShoppingBag } from "lucide-react";

type ShowLoginDrawerOptions = {
  title?: string;
  description?: string;
  imageSrc?: string;
  onCancel?: () => void;
};

const drawerState = {
  isOpen: false,
  options: {} as ShowLoginDrawerOptions,
  setIsOpen: null as null | ((open: boolean) => void),
};

export function showLoginDrawer(options?: ShowLoginDrawerOptions) {
  const defaultOptions: ShowLoginDrawerOptions = {
    title: "Login Required",
    description: "Please login to continue your personalized experience",
    imageSrc: "/images/login-required.webp",
    onCancel: () => {},
  };

  drawerState.options = { ...defaultOptions, ...options };

  if (drawerState.setIsOpen) {
    drawerState.setIsOpen(true);
  } else {
    setTimeout(() => {
      if (drawerState.setIsOpen) {
        drawerState.setIsOpen(true);
      }
    }, 100);
  }
}

export function LoginDrawerProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    drawerState.setIsOpen = setIsOpen;
    return () => {
      drawerState.setIsOpen = null;
    };
  }, []);

  const handleLogin = () => {
    setIsOpen(false);
    router.push("/login");
  };

  const handleClose = () => {
    setIsOpen(false);
    if (drawerState.options.onCancel) {
      drawerState.options.onCancel();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="max-w-md mx-auto bg-background border-border/50">
        <DrawerHeader className="text-center space-y-5 pt-6 pb-3">
          {/* Illustration with decorative background - Smaller and cuter */}
          {drawerState.options.imageSrc && (
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl scale-75 -z-10" />
              <Image
                src={drawerState.options.imageSrc}
                alt="Login prompt"
                width={140}
                height={140}
                className="rounded-2xl scale-125"
              />
            </div>
          )}

          {/* Title Section - More compact */}
          <div className="space-y-2.5">
            <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground">
              Welcome Back
            </p>
            <DrawerTitle className="text-xl sm:text-2xl font-medium italic tracking-tight text-foreground leading-tight">
              {drawerState.options.title}
            </DrawerTitle>
            <DrawerDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs mx-auto px-2">
              {drawerState.options.description}
            </DrawerDescription>
          </div>
        </DrawerHeader>

        <DrawerFooter className="gap-3 pb-8 px-6">
          <button
            onClick={handleLogin}
            className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm sm:text-base font-medium hover:opacity-90 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login to Continue
          </button>
          
          <DrawerClose asChild>
            <button
              onClick={handleClose}
              className="w-full inline-flex items-center justify-center bg-secondary text-foreground px-6 py-3 rounded-full text-sm sm:text-base font-medium border border-border/50 hover:bg-secondary/80 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}