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
      <body
        className={cn(
          "",
          inter.className
        )}
      >
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
      </body>
    </html>
  );
}