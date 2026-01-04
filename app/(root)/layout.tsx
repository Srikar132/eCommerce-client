// app/layout.tsx
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/tanstack/query-client";
import { categoryApi } from "@/lib/api/category";
import { FALLBACK_CATEGORIES } from "@/lib/constants/fallback-data";

import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar/navbar";
import EmailVerificationBanner from "@/components/auth/email-verification-banner";
import Footer from "@/components/footer";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/auth-provider";
import TanstackProvider from "@/providers/tanstack";

import { getServerAuth } from "@/lib/auth/server";
import { isTokenExpired } from "@/lib/auth/utils";

import { Toaster } from "sonner";
import { Category } from "@/types";


export const metadata = {
  title: "The Nala Armoire - Discover Your Style",
  description: "Where beauty roars in every stitch. Shop the latest fashion trends.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ---------------- AUTH (SERVER) ---------------- */
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let auth = await getServerAuth();

  if (
    !auth.isAuthenticated &&
    refreshToken &&
    !isTokenExpired(refreshToken)
  ) {
    auth = { user: null, isAuthenticated: false };
  }

  /* ---------------- REACT QUERY PREFETCH ---------------- */
  const queryClient = getQueryClient();

  try {
    // Root categories
    await queryClient.prefetchQuery({
      queryKey: ["categories", { minimal: true }],
      queryFn: async () => {
        return categoryApi.getCategories({
          filters: { minimal: true },
        });
      },
      staleTime: 1000 * 60 * 60,
    });

    // First category children (mega menu)
    const rootCategories = queryClient.getQueryData([
      "categories",
      { minimal: true },
    ]) as Category[];

    if (rootCategories?.length) {
      const first = rootCategories[0];

      await queryClient.prefetchQuery({
        queryKey: ["category-children", first.slug],
        queryFn: async () => {
          const data = await categoryApi.getCategories({
            filters: {
              slug: first.slug,
              recursive: true,
              minimal: true,
              includeProductCount: true,
            },
          });
          return data[0];
        },
        staleTime: 1000 * 60 * 60,
      });
    }
  } catch (_) {
    // Fallback safety
    queryClient.setQueryData(
      ["categories", { minimal: true }],
      FALLBACK_CATEGORIES
    );
  }

  const dehydratedState = dehydrate(queryClient);

  /* ---------------- RENDER ---------------- */
  return (
    <html lang="en">
      <body>
        <TanstackProvider>
          <HydrationBoundary state={dehydratedState}>
            <AuthProvider initialUser={auth.user}>
              <SidebarProvider defaultOpen={false}>
                <div className="font-sans w-full no-scrollbar">
                  <AppSidebar />

                  <header id="header">
                    <Navbar />
                    <EmailVerificationBanner className="mx-4 mb-4" />
                  </header>

                  <main className="w-full relative">{children}</main>

                  <Footer />
                  <Toaster position="top-right" className="z-50" />
                </div>
              </SidebarProvider>
            </AuthProvider>
          </HydrationBoundary>
        </TanstackProvider>
      </body>
    </html>
  );
}
