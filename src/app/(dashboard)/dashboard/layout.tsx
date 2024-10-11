import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";
import NavBar from "@/app/components/NavBar";
import "@/app/(index)/globals.css";
import { Toaster } from "@/app/components/ui/toaster";
import LayoutWrapper from "./components/overview/LayoutWrapper";
import { SideBarProvider } from "@/lib/context/SideBarContext";
import LoadingBar from "./components/ui/LoadingBar";
import { LoadingProvider } from "./components/ui/LoadingProvider";
import { ThemeProvider } from "@/app/components/theme-provider";
import ReactQueryProvider from "./components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "diaty - Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <body className={cn("w-screen overflow-x-hidden", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <ReactQueryProvider>
          <SessionProvider>
            <SideBarProvider>
              <LoadingProvider>
                <LayoutWrapper>
                  <LoadingBar />
                  <NavBar />
                  <main className="container">{children}</main>
                </LayoutWrapper>
                <Toaster />
              </LoadingProvider>
            </SideBarProvider>
          </SessionProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
