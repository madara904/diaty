import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";
import NavBar from "@/app/components/NavBar";
import Sidebar from "./components/Sidebar";
import "@/app/(index)/globals.css";
import { PremiumProvider } from "@/context/Premium";
import { Toaster } from "@/app/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "diaty - proper tracking your intakes!",
  description: "For those who want to make a change!",
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
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 container mx-auto">{children}</main>
            </div>
            <Toaster />
          </PremiumProvider>
        </SessionProvider>
      </body>
    </html>
  );
}