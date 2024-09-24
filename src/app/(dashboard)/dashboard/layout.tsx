import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";
import NavBar from "@/app/components/NavBar";
import Sidebar from "./components/overview/Sidebar";
import "@/app/(index)/globals.css";
import { PremiumProvider } from "@/context/Premium";
import { Toaster } from "@/app/components/ui/toaster";
import LayoutWrapper from "./components/overview/LayoutWrapper";
import { SideBarProvider } from "@/lib/context/SideBarContext";

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
          "flex flex-col bg-white-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] md:overflow-hidden",
          inter.className
        )}
      >
        <SessionProvider>
          <SideBarProvider>
            <LayoutWrapper>
              <NavBar />
              <main className="container">{children}</main>
            </LayoutWrapper>
            <Toaster />
          </SideBarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
