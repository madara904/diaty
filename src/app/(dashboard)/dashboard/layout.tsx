import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";
import "@/app/(index)/globals.css";
import { Toaster } from "@/app/components/ui/toaster";
import { ThemeProvider } from "@/app/components/theme-provider";
import NextTopLoader from 'nextjs-toploader';
import { SidebarProvider } from "@/app/components/ui/sidebar";
import { AppSidebar } from "./components/ui/app-sidebar";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "diaty - Dashboard",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <body className={cn("min-h-screen flex flex-col", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
              <NextTopLoader showSpinner={false}/>
              <div className="flex flex-1 min-h-screen">
                <AppSidebar/>
                <main className="flex-1 overflow-auto">
                  <div className="p-6">
                    {children}
                  </div>
                </main>
              </div>
              <Toaster />
            </SidebarProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
