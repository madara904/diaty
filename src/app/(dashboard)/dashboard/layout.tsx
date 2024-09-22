import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";
import NavBar from "@/app/components/NavBar";
import Sidebar from "./components/overview/Sidebar";
import "@/app/(index)/globals.css";
import { PremiumProvider } from "@/context/Premium";
import { Toaster } from "@/app/components/ui/toaster";

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
          "flex flex-col min-h-screen bg-white-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden",
          inter.className
        )}
      >
        <SessionProvider>
          <PremiumProvider>
            <NavBar />
            <div className="flex flex-col lg:flex-row mt-4 gap-4 overflow-auto">
              <Sidebar />
              <main className="flex-1 container mx-auto max-w-7xl">{children}</main>
            </div>
            <Toaster />
          </PremiumProvider>
        </SessionProvider>
      </body>
    </html>
  );
}